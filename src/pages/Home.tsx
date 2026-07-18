import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageShell } from '../components/layout/PageShell'
import { useAgentCue } from '../context/AgentCueContext'
import { useAgentScript, useAuthors, useCourse } from '../hooks/useCourseData'
import { assetUrl } from '../lib/assetUrl'
import { useUiMotion } from '../motion/useUiMotion'

export function Home() {
  const course = useCourse()
  const authors = useAuthors()
  const motionUi = useUiMotion()
  const { showCue, clearCue } = useAgentCue()
  const startCue = useAgentScript('hover:start')?.messages[0]
  const aboutCue = useAgentScript('hover:about')?.messages[0]
  const authorsCue = useAgentScript('hover:authors')?.messages[0]

  return (
    <PageShell agentContext="home">
      <section className="relative overflow-hidden rounded-card">
        <div className="absolute inset-0">
          <img
            src={assetUrl('/images/hero-digital-learning.jpg')}
            alt="تعلّم رقمي عبر الحاسوب في بيئة تعليمية حديثة"
            className="hero-visual h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-secondary-900/85 via-secondary-900/70 to-primary/55" />
        </div>

        <div className="relative z-10 px-5 py-12 sm:px-8 sm:py-16 lg:max-w-3xl">
          <motion.p
            {...motionUi.item(0)}
            className="mb-3 text-sm font-bold text-[#99F6E4]"
          >
            بيئة تعلم إلكتروني بحثية
          </motion.p>
          <motion.h1 {...motionUi.item(1)} className="page-title leading-tight text-white">
            الوكيل الافتراضي
          </motion.h1>
          <motion.p
            {...motionUi.item(2)}
            className="mt-3 text-sm font-semibold leading-7 text-white/90 sm:text-base"
          >
            {course.researchTitle}
          </motion.p>
          <motion.p
            {...motionUi.item(3)}
            className="mt-4 max-w-2xl text-sm leading-8 text-white/80 sm:text-base"
          >
            {course.introduction}
          </motion.p>
          <motion.div {...motionUi.item(4)} className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="btn-primary"
              onMouseEnter={() => startCue && showCue(startCue)}
              onMouseLeave={() => clearCue()}
              onFocus={() => startCue && showCue(startCue)}
              onBlur={() => clearCue()}
            >
              ابدأ التعلم
            </Link>
            <a
              href="#about-course"
              className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              onMouseEnter={() => aboutCue && showCue(aboutCue)}
              onMouseLeave={() => clearCue()}
              onFocus={() => aboutCue && showCue(aboutCue)}
              onBlur={() => clearCue()}
            >
              عن المقرر
            </a>
            <Link
              to="/authors"
              className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              onMouseEnter={() => authorsCue && showCue(authorsCue)}
              onMouseLeave={() => clearCue()}
              onFocus={() => authorsCue && showCue(authorsCue)}
              onBlur={() => clearCue()}
            >
              من نحن
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="about-course" className="mt-12 space-y-4">
        <motion.h2 {...motionUi.item(0)} className="section-title">
          عن المقرر
        </motion.h2>
        <div className="grid gap-4 md:grid-cols-2">
          <motion.article {...motionUi.item(1)} className="card p-5">
            <h3 className="font-bold text-secondary-900">أهداف المقرر</h3>
            <ul className="mt-3 space-y-2">
              {course.objectives.map((objective, index) => (
                <motion.li
                  key={objective}
                  {...motionUi.item(index + 2)}
                  className="flex gap-2 text-sm leading-7 text-secondary-700"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  {objective}
                </motion.li>
              ))}
            </ul>
          </motion.article>
          <div className="grid gap-4">
            {[
              { title: 'الفئة المستهدفة', body: course.targetAudience },
              { title: 'مدة التعلم', body: course.duration },
              {
                title: 'عدد الوحدات',
                body: `${course.modulesCount} وحدات تعليمية`,
              },
            ].map((item, index) => (
              <motion.article key={item.title} {...motionUi.item(index + 1)} className="card p-5">
                <h3 className="font-bold text-secondary-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-secondary-700">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-4" aria-labelledby="authors-preview-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <motion.h2
            {...motionUi.item(0)}
            id="authors-preview-title"
            className="section-title"
          >
            من نحن
          </motion.h2>
          <Link to="/authors" className="text-sm font-semibold text-primary hover:underline">
            عرض الصفحة
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {authors.map((author, index) => (
            <motion.article key={author.id} {...motionUi.item(index + 1)} className="card p-5">
              <h3 className="font-bold text-secondary-900">{author.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{author.title}</p>
              <p className="mt-2 text-sm text-secondary-600">{author.affiliation}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
