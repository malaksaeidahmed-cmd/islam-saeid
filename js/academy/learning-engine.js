// ============================================================
// Learning Engine — إدارة تقدم الطالب وإكمال الدروس
// ============================================================

import { markLessonComplete, addXP, awardBadge, getUserProgress } from '../auth/user-profile.js';
import { getCourseById, getCourseProgress } from './courses-data.js';
import { getNewlyEarnedBadges } from './badge-system.js';
import { showXPGain, showBadgeUnlock } from '../shared/xp-notifications.js';
import { XP_REWARDS } from './xp-system.js';
import { AcademyCMS } from './academy-cms.js';

// إكمال درس
export async function completeLesson(uid, lessonId, courseId) {
  try {
    // 1. تحديث قاعدة البيانات
    await markLessonComplete(uid, lessonId);
    await AcademyCMS.logEvent(uid, 'lesson_completed', { lessonId, courseId });

    // 2. إضافة نقاط الخبرة
    const xpResult = await addXP(uid, XP_REWARDS.LESSON_COMPLETE, `إكمال درس: ${lessonId}`);
    if (xpResult) showXPGain(XP_REWARDS.LESSON_COMPLETE, 'درس مكتمل');

    // 3. التحقق من الشارات الجديدة
    const progress = await getUserProgress(uid);
    const currentBadges = progress?.badges || [];
    const newBadges = getNewlyEarnedBadges(progress, currentBadges);

    for (const badge of newBadges) {
      await awardBadge(uid, badge.id);
      showBadgeUnlock(badge);
    }

    // 4. التحقق من إكمال المسار بالكامل
    checkCourseCompletion(uid, courseId, progress);

    return { success: true, xpResult, newBadges };
  } catch (error) {
    console.error('Error completing lesson:', error);
    return { success: false, error };
  }
}

// التحقق من إكمال المسار
export async function checkCourseCompletion(uid, courseId, progressData) {
  const course = getCourseById(courseId);
  if (!course) return;

  const completedLessons = progressData?.lessonsCompleted || [];
  const courseProgress = getCourseProgress(courseId, completedLessons);

  if (courseProgress.percent === 100) {
    // إضافة المسار للمكتملين (لو مش موجود)
    const completedCourses = progressData?.coursesCompleted || [];
    if (!completedCourses.includes(courseId)) {
      await AcademyCMS.saveStrategy(uid, { /* dummy to trigger update */ }); 
      // (يفضل نضيف دالة markCourseComplete في user-profile.js)
      
      // إضافة XP المسار
      await addXP(uid, XP_REWARDS.COURSE_COMPLETE, `إكمال مسار: ${course.title}`);
      showXPGain(XP_REWARDS.COURSE_COMPLETE, `مبارك! أكملت ${course.title}`);
    }
  }
}
