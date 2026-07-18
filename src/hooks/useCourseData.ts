import course from '../data/courses.json'
import modules from '../data/modules.json'
import lessons from '../data/lessons.json'
import activities from '../data/activities.json'
import quizzes from '../data/quizzes.json'
import achievementTest from '../data/achievement-test.json'
import agentScripts from '../data/agent-scripts.json'
import badges from '../data/badges.json'
import authors from '../data/authors.json'
import type {
  Activity,
  AgentScript,
  Author,
  Badge,
  Course,
  Lesson,
  Module,
  Quiz,
} from '../types'

const courseData = course as Course
const modulesData = modules as Module[]
const lessonsData = lessons as Lesson[]
const activitiesData = activities as Activity[]
const quizzesData = [...(quizzes as Quiz[]), achievementTest as Quiz]
const scriptsData = agentScripts as AgentScript[]
const badgesData = badges as Badge[]
const authorsData = authors as Author[]

export function useCourse() {
  return courseData
}

export function useModules() {
  return [...modulesData].sort((a, b) => a.order - b.order)
}

export function useModule(moduleId?: string) {
  return modulesData.find((module) => module.id === moduleId)
}

export function useLessonsByModule(moduleId?: string) {
  return lessonsData
    .filter((lesson) => lesson.moduleId === moduleId)
    .sort((a, b) => a.order - b.order)
}

export function useLesson(lessonId?: string) {
  return lessonsData.find((lesson) => lesson.id === lessonId)
}

export function useAllLessons() {
  return lessonsData
}

export function useActivity(activityId?: string) {
  return activitiesData.find((activity) => activity.id === activityId)
}

export function useQuiz(quizId?: string) {
  return quizzesData.find((quiz) => quiz.id === quizId)
}

export function useAgentScript(context: string) {
  const specific = scriptsData.find((script) => script.context === context)
  if (specific) return specific

  const base = context.split(':')[0]
  return scriptsData.find((script) => script.context === base)
}

export function useBadges() {
  return badgesData
}

export function useAuthors() {
  return authorsData
}

export function useNextPath(lesson?: Lesson) {
  if (!lesson) return '/dashboard'
  if (lesson.activityId) return `/activities/${lesson.activityId}`
  if (lesson.quizId) return `/quizzes/${lesson.quizId}`
  if (lesson.nextLessonId) return `/lessons/${lesson.nextLessonId}`
  return `/modules/${lesson.moduleId}`
}
