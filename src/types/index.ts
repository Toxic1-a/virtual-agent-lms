export type AgentMode = 'static' | 'animated'

export type ActivityType =
  | 'matching'
  | 'dragdrop'
  | 'mcq'
  | 'truefalse'
  | 'sorting'
  | 'fillblank'

export interface Course {
  id: string
  title: string
  researchTitle: string
  introduction: string
  objectives: string[]
  targetAudience: string
  duration: string
  modulesCount: number
}

export interface Author {
  id: string
  name: string
  title: string
  affiliation: string
  facebook: string
  initials: string
}

export interface Module {
  id: string
  courseId: string
  order: number
  title: string
  description: string
  estimatedTime: string
  objectives: string[]
  preQuizId?: string
  lessonIds: string[]
}

export interface LessonDownload {
  id: string
  title: string
  url: string
  type: string
}

export interface LessonImage {
  id: string
  src: string
  alt: string
  caption?: string
}

export interface Lesson {
  id: string
  moduleId: string
  order: number
  title: string
  videoUrl?: string
  captionsUrl?: string
  content: string
  images: LessonImage[]
  downloads: LessonDownload[]
  objectives: string[]
  summary: string
  nextLessonId?: string
  activityId?: string
  quizId?: string
}

export interface MatchingPair {
  id: string
  left: string
  right: string
}

export interface DragDropItem {
  id: string
  label: string
  zoneId: string
}

export interface DragDropZone {
  id: string
  label: string
}

export interface McqOption {
  id: string
  text: string
  correct: boolean
}

export interface SortingItem {
  id: string
  text: string
  correctOrder: number
}

export interface FillBlankItem {
  id: string
  sentence: string
  answer: string
  alternatives?: string[]
}

export interface Activity {
  id: string
  lessonId: string
  moduleId: string
  title: string
  instructions: string
  type: ActivityType
  pairs?: MatchingPair[]
  items?: DragDropItem[]
  zones?: DragDropZone[]
  options?: McqOption[]
  statement?: string
  correct?: boolean
  sortingItems?: SortingItem[]
  blanks?: FillBlankItem[]
  nextQuizId?: string
  nextActivityId?: string
  nextLessonId?: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  type?: 'mcq' | 'truefalse'
  imageUrl?: string
  options: McqOption[]
  explanation: string
}

export interface Quiz {
  id: string
  moduleId?: string
  lessonId?: string
  title: string
  instructions: string
  passingScore: number
  kind?: 'pre' | 'post' | 'general'
  questions: QuizQuestion[]
  nextLessonId?: string
  nextModuleId?: string
  isFinal?: boolean
}

export interface AgentScript {
  id: string
  context: string
  messages: string[]
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
}

export interface ActivityResult {
  activityId: string
  score: number
  completedAt: string
}

export interface QuizResult {
  quizId: string
  score: number
  total: number
  percentage: number
  completedAt: string
}

export interface ProgressState {
  completedLessons: string[]
  completedActivities: string[]
  activityResults: ActivityResult[]
  quizResults: QuizResult[]
  earnedBadges: string[]
  lastVisited?: string
}
