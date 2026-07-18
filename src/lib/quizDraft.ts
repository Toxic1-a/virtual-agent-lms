const STORAGE_PREFIX = 'virtual-agent-quiz-draft:'

export interface QuizDraft {
  answers: Record<string, string>
  page: number
  updatedAt: string
}

export function loadQuizDraft(quizId: string): QuizDraft | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${quizId}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as QuizDraft
    if (!parsed || typeof parsed.answers !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

export function saveQuizDraft(quizId: string, draft: Omit<QuizDraft, 'updatedAt'>) {
  try {
    const payload: QuizDraft = { ...draft, updatedAt: new Date().toISOString() }
    localStorage.setItem(`${STORAGE_PREFIX}${quizId}`, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

export function clearQuizDraft(quizId: string) {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${quizId}`)
  } catch {
    /* ignore */
  }
}
