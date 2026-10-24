// ============================================================
// Exam Engine — إدارة الامتحانات
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, updateDoc, arrayUnion, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { evaluateEssay } from '../ai/ai-evaluator.js';
import { getExamData } from './exams-data.js';
import { firebaseConfig } from '../../firebase-config.js'; // المسار الصح

// تعريف Firebase بشكل آمن
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function submitExam(uid, examId, userAnswers) {
  const exam = getExamData(examId);
  if (!exam) throw new Error('الامتحان غير موجود');

  let totalScore = 0;
  let maxScore = 0;
  let essayResults = [];

  // 1. تصحيح الأسئلة الموضوعية
  for (const question of exam.questions) {
    maxScore += question.points;
    
    if (question.type === 'mcq') {
      if (userAnswers[question.id] === question.correctAnswer) {
        totalScore += question.points;
      }
    } else if (question.type === 'essay') {
      const answer = userAnswers[question.id] || '';
      const evaluation = await evaluateEssay(question.question, answer);
      
      // تحويل درجة الـ AI (0-100) لدرجة السؤال
      const questionScore = (evaluation.score / 100) * question.points;
      totalScore += questionScore;
      
      essayResults.push({
        questionId: question.id,
        question: question.question,
        answer: answer,
        aiFeedback: evaluation,
        score: Math.round(questionScore),
        maxPoints: question.points
      });
    }
  }

  // 2. حساب النسبة المئوية والنجاح
  const percentage = Math.round((totalScore / maxScore) * 100);
  const passed = percentage >= exam.passingScore;

  // 3. حفظ النتيجة في Firestore
  const resultData = {
    examId: examId,
    unitId: exam.unitId,
    score: percentage,
    passed: passed,
    submittedAt: serverTimestamp(),
    essayResults: essayResults
  };

  await updateDoc(doc(db, 'student_progress', uid), {
    unitExamResults: arrayUnion(resultData),
    updatedAt: serverTimestamp()
  });

  // 4. إضافة نقاط الخبرة (XP)
  if (passed) {
    await updateDoc(doc(db, 'users', uid), {
      xp: increment(200)
    });
  }

  return {
    percentage,
    passed,
    essayResults,
    totalScore: Math.round(totalScore),
    maxScore
  };
}
