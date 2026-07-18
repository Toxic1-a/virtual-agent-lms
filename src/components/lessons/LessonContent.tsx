import { motion } from 'framer-motion'
import type { Lesson } from '../../types'
import { useUiMotion } from '../../motion/useUiMotion'

interface LessonContentProps {
  lesson: Lesson
}

export function LessonContent({ lesson }: LessonContentProps) {
  const motionUi = useUiMotion()
  const paragraphs = lesson.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section className="space-y-4" aria-labelledby="lesson-content-title">
      <h2 id="lesson-content-title" className="section-title">
        محتوى الدرس
      </h2>
      <motion.div {...motionUi.item(0)} className="card space-y-4 p-5">
        {paragraphs.map((paragraph, index) => {
          const isHeading =
            paragraph.length < 90 &&
            (paragraph.endsWith(':') ||
              /^(أولاً|أولًا|ثانياً|ثانيًا|ثالثاً|مفهوم|خصائص|تعريف|خطوات)/.test(paragraph))

          return isHeading ? (
            <motion.h3
              key={`${index}-${paragraph.slice(0, 20)}`}
              {...motionUi.item(Math.min(index, 10))}
              className="text-lg font-bold text-secondary-900"
            >
              {paragraph}
            </motion.h3>
          ) : (
            <motion.p
              key={`${index}-${paragraph.slice(0, 20)}`}
              {...motionUi.item(Math.min(index, 10))}
              className="leading-8 text-secondary-800"
            >
              {paragraph}
            </motion.p>
          )
        })}
      </motion.div>

      {lesson.images.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {lesson.images.map((image, index) => (
            <motion.figure
              key={image.id}
              {...motionUi.item(index)}
              whileHover={motionUi.hover}
              className="card overflow-hidden"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-80 w-full bg-secondary-50 object-contain p-2"
              />
              {image.caption ? (
                <figcaption className="p-3 text-sm text-secondary-600">{image.caption}</figcaption>
              ) : null}
            </motion.figure>
          ))}
        </div>
      ) : null}

      {lesson.downloads.length > 0 ? (
        <motion.div {...motionUi.item(1)} className="card p-5">
          <h3 className="mb-3 font-bold text-secondary-900">ملفات للتحميل</h3>
          <ul className="space-y-2">
            {lesson.downloads.map((file) => (
              <li key={file.id}>
                <a
                  href={file.url}
                  download
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <span aria-hidden>↓</span>
                  {file.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </section>
  )
}
