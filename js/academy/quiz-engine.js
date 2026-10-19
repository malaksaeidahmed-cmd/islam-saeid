// ============================================================
// Quiz Engine — تقييم الاختبارات وإدارة النتائج
// ============================================================

import { addXP, markQuizPassed } from '../auth/user-profile.js';
import { AcademyCMS } from './academy-cms.js';
import { showXPGain } from '../shared/xp-notifications.js';
import { XP_REWARDS } from './xp-system.js';

// تقييم إجابات الطالب
export function evaluateQuiz(quizData, userAnswers) {
  let correctCount = 0;
  const results = [];

  quizData.questions.forEach((q, index) => {
    const isCorrect = userAnswers[index] === q.correctAnswer;
    if (isCorrect) correctCount++;
    
    results.push({
      questionId: q.id,
      question: q.question,
      userAnswer: userAnswers[index],
      correctAnswer: q.correctAnswer,
      isCorrect: isCorrect,
      explanation: q.explanation,
      options: q.options
    });
  });

  const totalQuestions = quizData.questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= quizData.passingScore;

  return {
    score,
    passed,
    correctCount,
    totalQuestions,
    results
  };
}

// حفظ نتيجة الاختبار
export async function saveQuizResult(uid, quizId, lessonId, evaluation, timeSpent) {
  try {
    // 1. حفظ المحاولة
    await AcademyCMS.submitQuizAttempt({
      uid,
      quizId,
      lessonId,
      score: evaluation.score,
      passed: evaluation.passed,
      answers: evaluation.results,
      duration: timeSpent
    });

    // 2. إذا نجح، نضيف XP وعلامة النجاح
    if (evaluation.passed) {
      await markQuizPassed(uid, quizId);
      
      const isPerfect = evaluation.score === 100;
      const xpAmount = isPerfect ? XP_REWARDS.QUIZ_PERFECT : XP_REWARDS.QUIZ_PASS;
      
      await addXP(uid, xpAmount, `اجتياز اختبار: ${quizId}`);
      showXPGain(xpAmount, isPerfect ? 'درجة كاملة!' : 'اختبار ناجح');
    }

    return true;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return false;
  }
}
