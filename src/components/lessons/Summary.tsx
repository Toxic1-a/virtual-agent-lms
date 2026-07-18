interface SummaryProps {
  text: string
}

export function Summary({ text }: SummaryProps) {
  return (
    <section className="rounded-card border border-accent/30 bg-accent-50 p-5" aria-labelledby="summary-title">
      <h2 id="summary-title" className="section-title mb-2">
        ملخص الدرس
      </h2>
      <p className="leading-8 text-secondary-800">{text}</p>
    </section>
  )
}
