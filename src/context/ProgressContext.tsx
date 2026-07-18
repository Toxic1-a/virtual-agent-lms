import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import lessonsData from '../data/lessons.json'
import type { ActivityResult, ProgressState, QuizResult } from '../types'

const STORAGE_KEY = 'virtual-agent-lms-progress'

const defaultState: ProgressState = {
  completedLessons: [],
  completedActivities: [],
  activityResults: [],
  quizResults: [],
  earnedBadges: [],
}

interface ProgressContextValue {
  progress: ProgressState
  completionPercent: number
  finishedLessonsCount: number
  remainingLessonsCount: number
  totalLessons: number
  markLessonComplete: (lessonId: string) => void
  markActivityComplete: (activityId: string, score: number) => void
  markQuizComplete: (result: Omit<QuizResult, 'completedAt'>) => void
  hasBadge: (badgeId: string) => boolean
  resetProgress: () => void
  isLessonComplete: (lessonId: string) => boolean
  isActivityComplete: (activityId: string) => boolean
  getQuizResult: (quizId: string) => QuizResult | undefined
  isModuleComplete: (moduleId: string) => boolean
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const saved = { ...defaultState, ...JSON.parse(raw) } as ProgressState
    const validLessonIds = new Set(lessonsData.map((lesson) => lesson.id))
    return {
      ...saved,
      completedLessons: saved.completedLessons.filter((id) => validLessonIds.has(id)),
    }
  } catch {
    return defaultState
  }
}

function evaluateBadges(state: ProgressState): string[] {
  const earned = new Set(state.earnedBadges)
  const lessons = lessonsData

  if (state.completedLessons.length >= 1) earned.add('first-lesson')

  const module1Lessons = lessons.filter((l) => l.moduleId === 'module-1').map((l) => l.id)
  if (module1Lessons.every((id) => state.completedLessons.includes(id))) {
    earned.add('module-1-done')
  }

  const module2Lessons = lessons.filter((l) => l.moduleId === 'module-2').map((l) => l.id)
  if (module2Lessons.every((id) => state.completedLessons.includes(id))) {
    earned.add('module-2-done')
  }

  const module3Lessons = lessons.filter((l) => l.moduleId === 'module-3').map((l) => l.id)
  if (module3Lessons.every((id) => state.completedLessons.includes(id))) {
    earned.add('module-3-done')
  }

  if (state.quizResults.some((q) => q.percentage >= 70)) {
    earned.add('quiz-master')
  }

  if (state.quizResults.some((q) => q.quizId === 'achievement-test' && q.percentage >= 90)) {
    earned.add('achievement-master')
  }

  const allLessonIds = lessons.map((l) => l.id)
  const requiredQuizzes = [
    'module-1-pretest',
    'module-2-pretest',
    'module-3-pretest',
    'achievement-test',
  ]
  const allQuizzesDone = requiredQuizzes.every((id) =>
    state.quizResults.some((q) => q.quizId === id),
  )
  if (allLessonIds.every((id) => state.completedLessons.includes(id)) && allQuizzesDone) {
    earned.add('course-complete')
  }

  return Array.from(earned)
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadState())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      /* ignore quota / private mode */
    }
  }, [progress])

  const totalLessons = lessonsData.length
  const finishedLessonsCount = progress.completedLessons.length
  const remainingLessonsCount = Math.max(totalLessons - finishedLessonsCount, 0)

  // Weighted progress: lessons 70% + required quizzes 30% (3 pretests + achievement)
  const requiredQuizIds = [
    'module-1-pretest',
    'module-2-pretest',
    'module-3-pretest',
    'achievement-test',
  ]
  const finishedQuizzesCount = requiredQuizIds.filter((id) =>
    progress.quizResults.some((q) => q.quizId === id),
  ).length
  const lessonShare = totalLessons ? finishedLessonsCount / totalLessons : 0
  const quizShare = finishedQuizzesCount / requiredQuizIds.length
  const completionPercent = Math.round(lessonShare * 70 + quizShare * 30)

  const updateWithBadges = useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setProgress((prev) => {
      const next = updater(prev)
      return { ...next, earnedBadges: evaluateBadges(next) }
    })
  }, [])

  const markLessonComplete = useCallback(
    (lessonId: string) => {
      updateWithBadges((prev) => ({
        ...prev,
        completedLessons: prev.completedLessons.includes(lessonId)
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId],
        lastVisited: `/lessons/${lessonId}`,
      }))
    },
    [updateWithBadges],
  )

  const markActivityComplete = useCallback(
    (activityId: string, score: number) => {
      const result: ActivityResult = {
        activityId,
        score,
        completedAt: new Date().toISOString(),
      }
      updateWithBadges((prev) => ({
        ...prev,
        completedActivities: prev.completedActivities.includes(activityId)
          ? prev.completedActivities
          : [...prev.completedActivities, activityId],
        activityResults: [
          ...prev.activityResults.filter((item) => item.activityId !== activityId),
          result,
        ],
        lastVisited: `/activities/${activityId}`,
      }))
    },
    [updateWithBadges],
  )

  const markQuizComplete = useCallback(
    (result: Omit<QuizResult, 'completedAt'>) => {
      const full: QuizResult = { ...result, completedAt: new Date().toISOString() }
      updateWithBadges((prev) => ({
        ...prev,
        quizResults: [...prev.quizResults.filter((item) => item.quizId !== result.quizId), full],
        lastVisited: `/quizzes/${result.quizId}`,
      }))
    },
    [updateWithBadges],
  )

  const resetProgress = useCallback(() => {
    setProgress(defaultState)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      completionPercent,
      finishedLessonsCount,
      remainingLessonsCount,
      totalLessons,
      markLessonComplete,
      markActivityComplete,
      markQuizComplete,
      hasBadge: (badgeId) => progress.earnedBadges.includes(badgeId),
      resetProgress,
      isLessonComplete: (lessonId) => progress.completedLessons.includes(lessonId),
      isActivityComplete: (activityId) => progress.completedActivities.includes(activityId),
      getQuizResult: (quizId) => progress.quizResults.find((item) => item.quizId === quizId),
      isModuleComplete: (moduleId) => {
        const ids = lessonsData
          .filter((lesson) => lesson.moduleId === moduleId)
          .map((lesson) => lesson.id)
        return ids.length > 0 && ids.every((id) => progress.completedLessons.includes(id))
      },
    }),
    [
      progress,
      completionPercent,
      finishedLessonsCount,
      remainingLessonsCount,
      totalLessons,
      markLessonComplete,
      markActivityComplete,
      markQuizComplete,
      resetProgress,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
