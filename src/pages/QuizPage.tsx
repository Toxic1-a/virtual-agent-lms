import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { QuestionCard } from '../components/quiz/QuestionCard'
import { Score } from '../components/quiz/Score'
import { useAgentCue } from '../context/AgentCueContext'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import { useQuiz } from '../hooks/useCourseData'
import { clearQuizDraft, loadQuizDraft, saveQuizDraft } from '../lib/quizDraft'

const PAGE_SIZE = 10
const INTRO_KEY = 'virtual-agent-achievement-intro-seen'

export function QuizPage() {
  const { quizId } = useParams()
  const quiz = useQuiz(quizId)
  const { markQuizComplete, getQuizResult } = useProgress()
  const { play } = useSound()
  const { react } = useAgentCue()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [page, setPage] = useState(0)
  const [retake, setRetake] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)

  const existing = quiz ? getQuizResult(quiz.id) : undefined
  const isAchievement = quiz?.id === 'achievement-test'
  const paginated = Boolean(isAchievement && !submitted && (retake || !existing))

  const totalPages = quiz ? Math.max(1, Math.ceil(quiz.questions.length / PAGE_SIZE)) : 1
  const pageQuestions = useMemo(() => {
    if (!quiz) return []
    if (!paginated) return quiz.questions
    const start = page * PAGE_SIZE
    return quiz.questions.slice(start, start + PAGE_SIZE)
  }, [quiz, paginated, page])

  useEffect(() => {
    setSubmitted(false)
    setRetake(false)
    setDraftRestored(false)

    if (!quizId) return

    const draft = loadQuizDraft(quizId)
    if (draft && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers)
      setPage(draft.page || 0)
      setDraftRestored(true)
      setShowIntro(false)
    } else {
      setAnswers({})
      setPage(0)
      if (quizId === 'achievement-test') {
        try {
          setShowIntro(localStorage.getItem(INTRO_KEY) !== '1')
        } catch {
          setShowIntro(true)
        }
      } else {
        setShowIntro(false)
      }
    }
  }, [quizId])

  useEffect(() => {
    if (!quiz || submitted || (existing && !retake)) return
    if (Object.keys(answers).length === 0 && page === 0) return
    saveQuizDraft(quiz.id, { answers, page })
  }, [answers, page, quiz, submitted, existing, retake])

  const result = useMemo(() => {
    if (!quiz || (!submitted && !existing) || (retake && !submitted)) return null
    if (existing && !submitted && !retake) {
      return {
        score: existing.score,
        total: existing.total,
        percentage: existing.percentage,
      }
    }

    let score = 0
    quiz.questions.forEach((question) => {
      const selected = answers[question.id]
      const option = question.options.find((item) => item.id === selected)
      if (option?.correct) score += 1
    })
    const total = quiz.questions.length
    const percentage = Math.round((score / total) * 100)
    return { score, total, percentage }
  }, [answers, existing, quiz, submitted, retake])

  if (!quiz) {
    return (
      <PageShell agentContext="quiz">
        <p>الاختبار غير موجود.</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex">
          العودة للوحة المقرر
        </Link>
      </PageShell>
    )
  }

  const answeredCount = Object.keys(answers).length
  const pageAnswered = pageQuestions.every((q) => answers[q.id])
  const allAnswered = answeredCount >= quiz.questions.length
  const revealed = submitted || (Boolean(existing) && !retake)

  const handleSubmit = () => {
    if (!allAnswered) return

    let score = 0
    quiz.questions.forEach((question) => {
      const selected = answers[question.id]
      const option = question.options.find((item) => item.id === selected)
      if (option?.correct) score += 1
    })
    const total = quiz.questions.length
    const percentage = Math.round((score / total) * 100)
    markQuizComplete({ quizId: quiz.id, score, total, percentage })
    clearQuizDraft(quiz.id)
    play(percentage >= quiz.passingScore ? 'success' : 'error')
    react(percentage >= quiz.passingScore ? 'celebrating' : 'incorrect')
    setSubmitted(true)
    setRetake(false)
  }

  const nextPath = quiz.isFinal
    ? '/completion'
    : quiz.nextLessonId
      ? `/lessons/${quiz.nextLessonId}`
      : quiz.nextModuleId
        ? `/modules/${quiz.nextModuleId}`
        : quiz.moduleId
          ? `/modules/${quiz.moduleId}`
          : '/dashboard'

  const agentMood =
    result && result.percentage >= quiz.passingScore
      ? 'celebrating'
      : result
        ? 'encouraging'
        : 'think'

  if (isAchievement && showIntro && !revealed) {
    return (
      <PageShell agentContext="quiz" agentMood="idle">
        <div className="mx-auto max-w-3xl space-y-6">
          <header>
            <p className="text-sm font-bold text-primary">قبل البدء</p>
            <h1 className="page-title">تعليمات الاختبار التحصيلي</h1>
          </header>

          <div className="card space-y-4 p-5 text-sm leading-8 text-secondary-800">
            <p>
              يهدف هذا الاختبار إلى قياس الجوانب المعرفية لمهارات المعلم الرقمي. يتكون من{' '}
              <strong>{quiz.questions.length}</strong> مفردة: اختيار من متعدد وصواب وخطأ.
            </p>
            <ul className="list-disc space-y-2 pr-5">
              <li>اقرأ كل سؤال بدقة قبل الإجابة، ولاحظ الصور إن وُجدت.</li>
              <li>لا تترك أي سؤال دون إجابة.</li>
              <li>درجة النجاح المطلوبة: {quiz.passingScore}% فأكثر.</li>
              <li>يُعرض الاختبار على صفحات (10 أسئلة في الصفحة) لتسهيل الإجابة.</li>
              <li>تُحفظ إجاباتك تلقائيًا إذا أغلقت الصفحة بالخطأ ويمكنك المتابعة لاحقًا.</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                try {
                  localStorage.setItem(INTRO_KEY, '1')
                } catch {
                  /* ignore */
                }
                setShowIntro(false)
              }}
            >
              ابدأ الاختبار الآن
            </button>
            <Link to="/dashboard" className="btn-secondary">
              العودة لاحقًا
            </Link>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell agentContext="quiz" agentMood={agentMood}>
      <div className="space-y-5">
        <header>
          <p className="text-sm font-bold text-primary">
            {isAchievement ? 'اختبار تحصيلي' : quiz.kind === 'pre' ? 'اختبار قبلي' : 'اختبار'}
          </p>
          <h1 className="page-title">{quiz.title}</h1>
          <p className="mt-2 muted">{quiz.instructions}</p>
          {paginated ? (
            <p className="mt-2 text-sm font-semibold text-secondary-700">
              الصفحة {page + 1} من {totalPages} — تم الإجابة على {answeredCount} من{' '}
              {quiz.questions.length}
            </p>
          ) : null}
          {draftRestored && !revealed ? (
            <p className="mt-2 rounded-xl bg-accent-50 px-3 py-2 text-sm font-semibold text-accent-700">
              تم استرجاع إجاباتك السابقة تلقائيًا. يمكنك المتابعة من حيث توقفت.
            </p>
          ) : null}
        </header>

        {revealed && existing && !retake ? (
          <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm text-secondary-700">
              لديك نتيجة سابقة لهذا الاختبار. يمكنك مراجعة الدرجة أو إعادة المحاولة.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setRetake(true)
                setSubmitted(false)
                setAnswers({})
                setPage(0)
                clearQuizDraft(quiz.id)
                setDraftRestored(false)
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        ) : null}

        <div className="space-y-4">
          {pageQuestions.map((question, index) => {
            const absoluteIndex = paginated ? page * PAGE_SIZE + index : index
            return (
              <QuestionCard
                key={question.id}
                question={question}
                index={absoluteIndex}
                total={quiz.questions.length}
                selectedId={answers[question.id]}
                revealed={revealed}
                onSelect={(optionId) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: optionId,
                  }))
                }
              />
            )
          })}
        </div>

        {!revealed ? (
          <div className="flex flex-wrap items-center gap-3">
            {paginated && page > 0 ? (
              <button type="button" className="btn-secondary" onClick={() => setPage((p) => p - 1)}>
                السابق
              </button>
            ) : null}

            {paginated && page < totalPages - 1 ? (
              <button
                type="button"
                className="btn-primary"
                disabled={!pageAnswered}
                onClick={() => {
                  setPage((p) => p + 1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                التالي
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                disabled={!allAnswered}
                data-sound="off"
                onClick={handleSubmit}
              >
                إرسال الإجابات
              </button>
            )}
          </div>
        ) : null}

        {result ? (
          <div className="space-y-4">
            <Score
              score={result.score}
              total={result.total}
              percentage={result.percentage}
              passingScore={quiz.passingScore}
            />
            <div className="flex flex-wrap gap-3">
              <Link to={nextPath} className="btn-primary inline-flex">
                {quiz.isFinal
                  ? 'عرض صفحة الإنجاز'
                  : quiz.nextLessonId
                    ? 'الانتقال إلى محتوى الموديول'
                    : 'العودة للموديول'}
              </Link>
              {!retake ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setRetake(true)
                    setSubmitted(false)
                    setAnswers({})
                    setPage(0)
                    clearQuizDraft(quiz.id)
                    if (isAchievement) setShowIntro(true)
                  }}
                >
                  إعادة المحاولة
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  )
}
