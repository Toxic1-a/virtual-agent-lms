import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { useAuthors } from '../hooks/useCourseData'
import { useUiMotion } from '../motion/useUiMotion'

export function AuthorsPage() {
  const authors = useAuthors()
  const motionUi = useUiMotion()

  return (
    <PageShell agentContext="authors" showAgent={false}>
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="page-title">من نحن</h1>
          <p className="text-secondary-600">أسماء القائمين على إعداد هذه البيئة التعليمية</p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {authors.map((author, index) => (
            <motion.article
              key={author.id}
              {...motionUi.item(index)}
              whileHover={motionUi.hover}
              className="card flex h-full flex-col p-6"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white"
                  aria-hidden
                >
                  {author.initials}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">{author.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-primary">{author.title}</p>
                  <p className="mt-2 text-sm leading-7 text-secondary-600">{author.affiliation}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-secondary-100 pt-4">
                <p className="mb-3 text-sm font-semibold text-secondary-800">للتواصل</p>
                <a
                  href={author.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full sm:w-auto"
                  aria-label={`صفحة فيسبوك ${author.name}`}
                >
                  صفحة فيسبوك
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <Link to="/" className="btn-secondary inline-flex">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
