import type { ProgressState } from '../types'

const QUIZ_TITLES: Record<string, string> = {
  'module-1-pretest': 'الاختبار القبلي — الموديول الأول',
  'module-2-pretest': 'الاختبار القبلي — الموديول الثاني',
  'module-3-pretest': 'الاختبار القبلي — الموديول الثالث',
  'achievement-test': 'الاختبار التحصيلي',
}

function csvEscape(value: string | number) {
  const text = String(value)
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

/** Export local progress as a CSV file for research logging. */
export function exportProgressCsv(progress: ProgressState, completionPercent: number) {
  const rows: string[][] = [
    ['النوع', 'المعرّف', 'العنوان', 'الدرجة', 'من', 'النسبة', 'التاريخ'],
  ]

  for (const result of progress.quizResults) {
    rows.push([
      'اختبار',
      result.quizId,
      QUIZ_TITLES[result.quizId] ?? result.quizId,
      String(result.score),
      String(result.total),
      `${result.percentage}%`,
      result.completedAt,
    ])
  }

  for (const lessonId of progress.completedLessons) {
    rows.push(['درس مكتمل', lessonId, lessonId, '', '', '', ''])
  }

  for (const badgeId of progress.earnedBadges) {
    rows.push(['شارة', badgeId, badgeId, '', '', '', ''])
  }

  rows.push(['ملخص', 'completionPercent', 'نسبة إكمال المسار', '', '', `${completionPercent}%`, ''])
  rows.push(['ملخص', 'agentMode', localStorage.getItem('virtual-agent-mode') ?? 'static', '', '', '', ''])
  rows.push(['ملخص', 'exportedAt', new Date().toISOString(), '', '', '', ''])

  const csv = `\uFEFF${rows.map((row) => row.map(csvEscape).join(',')).join('\n')}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
  link.href = url
  link.download = `نتائج-الوكيل-الافتراضي-${stamp}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
