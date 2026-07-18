interface ObjectivesProps {
  items: string[]
}

export function Objectives({ items }: ObjectivesProps) {
  return (
    <section className="card p-5" aria-labelledby="objectives-title">
      <h2 id="objectives-title" className="section-title mb-3">
        أهداف التعلم
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-secondary-800">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
