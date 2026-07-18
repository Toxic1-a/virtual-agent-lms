import { motion } from 'framer-motion'
import type { QuizQuestion } from '../../types'
import { assetUrl, isAssetPath } from '../../lib/assetUrl'
import { useUiMotion } from '../../motion/useUiMotion'

interface QuestionCardProps {
  question: QuizQuestion
  index: number
  total: number
  selectedId?: string
  onSelect: (optionId: string) => void
  revealed?: boolean
}

export function QuestionCard({
  question,
  index,
  total,
  selectedId,
  onSelect,
  revealed,
}: QuestionCardProps) {
  const isTrueFalse = question.type === 'truefalse'
  const motionUi = useUiMotion()

  return (
    <motion.article {...motionUi.item(Math.min(index, 8))} className="card space-y-4 p-5">
      <div className="flex items-center justify-between text-sm font-semibold text-secondary-600">
        <span>
          السؤال {index + 1} من {total}
        </span>
        <span>{isTrueFalse ? 'صواب / خطأ' : 'اختيار من متعدد'}</span>
      </div>
      <h2 className="text-lg font-bold leading-8 text-secondary-900">{question.prompt}</h2>

      {question.imageUrl ? (
        <figure className="overflow-hidden rounded-card border border-secondary-100 bg-secondary-50">
          <img
            src={assetUrl(question.imageUrl)}
            alt="صورة مرفقة بالسؤال"
            className="mx-auto max-h-72 w-auto object-contain p-3"
          />
        </figure>
      ) : null}

      <fieldset className="space-y-2">
        <legend className="sr-only">{question.prompt}</legend>
        <div
          className={
            question.options.some((o) => isAssetPath(o.text))
              ? 'grid gap-3 sm:grid-cols-2'
              : 'space-y-2'
          }
        >
          {question.options.map((option, optionIndex) => {
            const selected = selectedId === option.id
            const isImageOption = isAssetPath(option.text)
            let stateClass = 'border-secondary-100 bg-white hover:border-primary/30'
            if (revealed && option.correct) stateClass = 'visual-feedback-correct'
            if (revealed && selected && !option.correct) stateClass = 'visual-feedback-incorrect'
            if (!revealed && selected) stateClass = 'border-primary bg-primary-50'

            return (
              <motion.label
                key={option.id}
                {...motionUi.item(optionIndex)}
                whileHover={motionUi.animated && !revealed ? { scale: 1.01, x: -2 } : undefined}
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 transition ${stateClass}`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={selected}
                  disabled={revealed}
                  onChange={() => onSelect(option.id)}
                  className="mt-1"
                />
                {isImageOption ? (
                  <img
                    src={assetUrl(option.text)}
                    alt={`خيار ${option.id}`}
                    className="max-h-24 w-auto rounded-lg border border-secondary-100 object-contain"
                  />
                ) : (
                  <span>{option.text}</span>
                )}
              </motion.label>
            )
          })}
        </div>
      </fieldset>
      {revealed && question.explanation ? (
        <p className="rounded-xl bg-secondary-50 px-3 py-2 text-sm text-secondary-700" role="status">
          {question.explanation}
        </p>
      ) : null}
    </motion.article>
  )
}
