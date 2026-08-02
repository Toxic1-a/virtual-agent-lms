import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageShell } from '../components/layout/PageShell'
import { FadeInSection } from '../components/motion/FadeInSection'
import { useAgentCue } from '../context/AgentCueContext'
import { useAgentScript, useAuthors, useCourse } from '../hooks/useCourseData'
import { assetUrl } from '../lib/assetUrl'
import { useUiMotion } from '../motion/useUiMotion'

const HERO_TITLE = 'الوكيل الافتراضي'

export function Home() {
  const course = useCourse()
  const authors = useAuthors()
  const motionUi = useUiMotion()
  const { showCue, clearCue } = useAgentCue()
  const startCue = useAgentScript('hover:start')?.messages[0]
  const aboutCue = useAgentScript('hover:about')?.messages[0]
  const authorsCue = useAgentScript('hover:authors')?.messages[0]
  const heroWords = HERO_TITLE.split(/\s+/).filter(Boolean)

  return (
    <PageShell agentContext="home">
      <FadeInSection delay={0}>
        <section
          className={`relative overflow-hidden rounded-card ${
            motionUi.animated ? 'hero-gradient-live' : ''
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={assetUrl('/images/hero-digital-learning.jpg')}
              alt="تعلّم رقمي عبر الحاسوب في بيئة تعليمية حديثة"
              className="hero-visual h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-secondary-900/85 via-secondary-900/70 to-primary/55 hero-overlay-live" />
          </div>

          <div className="relative z-10 px-5 py-12 sm:px-8 sm:py-16 lg:max-w-3xl">
            <motion.p
              {...motionUi.item(0)}
              className="mb-3 text-sm font-bold text-[#99F6E4]"
            >
              بيئة تعلم إلكتروني بحثية
            </motion.p>

            {motionUi.animated ? (
              <motion.h1
                className="page-title leading-tight text-white"
                variants={motionUi.staggerContainer}
                initial="hidden"
                animate="visible"
                aria-label={HERO_TITLE}
              >
                {heroWords.map((word, index) => (
                  <motion.span
                    key={`${word}-${index}`}
                    variants={motionUi.staggerItem}
                    className="ml-2 inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            ) : (
              <h1 className="page-title leading-tight text-white">{HERO_TITLE}</h1>
            )}

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
              <motion.div whileHover={motionUi.hover} whileTap={motionUi.tap}>
                <Link
                  to="/dashboard"
                  className="btn-primary cta-float"
                  onMouseEnter={() => startCue && showCue(startCue, { mood: 'pointing' })}
                  onMouseLeave={() => clearCue()}
                  onFocus={() => startCue && showCue(startCue, { mood: 'pointing' })}
                  onBlur={() => clearCue()}
                >
                  ابدأ التعلم
                </Link>
              </motion.div>
              <motion.div whileHover={motionUi.hover} whileTap={motionUi.tap}>
                <a
                  href="#about-course"
                  className="btn cta-float border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                  onMouseEnter={() => aboutCue && showCue(aboutCue, { mood: 'explaining' })}
                  onMouseLeave={() => clearCue()}
                  onFocus={() => aboutCue && showCue(aboutCue, { mood: 'explaining' })}
                  onBlur={() => clearCue()}
                >
                  عن المقرر
                </a>
              </motion.div>
              <motion.div whileHover={motionUi.hover} whileTap={motionUi.tap}>
                <Link
                  to="/authors"
                  className="btn cta-float border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                  onMouseEnter={() => authorsCue && showCue(authorsCue, { mood: 'greeting' })}
                  onMouseLeave={() => clearCue()}
                  onFocus={() => authorsCue && showCue(authorsCue, { mood: 'greeting' })}
                  onBlur={() => clearCue()}
                >
                  من نحن
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <section id="about-course" className="mt-12 space-y-4">
          <motion.h2 {...motionUi.item(0)} className="section-title">
            عن المقرر
          </motion.h2>
          <motion.div
            className="grid gap-4 md:grid-cols-2"
            variants={motionUi.staggerContainer}
            {...motionUi.staggerProps}
          >
            <motion.article
              variants={motionUi.staggerItem}
              whileHover={motionUi.hover}
              whileTap={motionUi.tap}
              className="card p-5"
            >
              <h3 className="font-bold text-secondary-900">أهداف المقرر</h3>
              <motion.ul
                className="list-wave mt-3 space-y-2"
                variants={motionUi.staggerContainer}
                {...motionUi.staggerProps}
              >
                {course.objectives.map((objective) => (
                  <motion.li
                    key={objective}
                    variants={motionUi.staggerItem}
                    className="flex gap-2 text-sm leading-7 text-secondary-700"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                    {objective}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.article>
            <motion.div className="grid gap-4" variants={motionUi.staggerContainer}>
              {[
                { title: 'الفئة المستهدفة', body: course.targetAudience },
                { title: 'مدة التعلم', body: course.duration },
                {
                  title: 'عدد الوحدات',
                  body: `${course.modulesCount} وحدات تعليمية`,
                },
              ].map((item) => (
                <motion.article
                  key={item.title}
                  variants={motionUi.staggerItem}
                  whileHover={motionUi.hover}
                  whileTap={motionUi.tap}
                  className="card p-5"
                >
                  <h3 className="font-bold text-secondary-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-secondary-700">{item.body}</p>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </section>
      </FadeInSection>

      <FadeInSection delay={0.2}>
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
          <motion.div
            className="grid gap-4 md:grid-cols-2"
            variants={motionUi.staggerContainer}
            {...motionUi.staggerProps}
          >
            {authors.map((author) => (
              <motion.article
                key={author.id}
                variants={motionUi.staggerItem}
                whileHover={motionUi.hover}
                whileTap={motionUi.tap}
                className="card p-5"
              >
                <h3 className="font-bold text-secondary-900">{author.name}</h3>
                <p className="mt-1 text-sm font-semibold text-primary">{author.title}</p>
                <p className="mt-2 text-sm text-secondary-600">{author.affiliation}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>
      </FadeInSection>
    </PageShell>
  )
}
