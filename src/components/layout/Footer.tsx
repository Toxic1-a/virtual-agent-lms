import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-secondary-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-secondary-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>بيئة تعلم إلكتروني لأغراض بحثية — المعلم الرقمي</p>
        <p>
          إعداد:{' '}
          <Link to="/authors" className="font-semibold text-primary hover:underline">
            د/ مارلين عصام شوقي و د/ هند عماد حمودة
          </Link>
        </p>
      </div>
    </footer>
  )
}
