import type { Activity } from '../../types'
import { DragDrop } from './DragDrop'
import { FillBlank } from './FillBlank'
import { Matching } from './Matching'
import { MCQ } from './MCQ'
import { Sorting } from './Sorting'
import { TrueFalse } from './TrueFalse'

interface ActivityRendererProps {
  activity: Activity
  onComplete: (score: number) => void
}

export function ActivityRenderer({ activity, onComplete }: ActivityRendererProps) {
  switch (activity.type) {
    case 'matching':
      return <Matching pairs={activity.pairs ?? []} onComplete={onComplete} />
    case 'dragdrop':
      return (
        <DragDrop
          items={activity.items ?? []}
          zones={activity.zones ?? []}
          onComplete={onComplete}
        />
      )
    case 'mcq':
      return <MCQ options={activity.options ?? []} onComplete={onComplete} />
    case 'truefalse':
      return (
        <TrueFalse
          statement={activity.statement ?? ''}
          correct={Boolean(activity.correct)}
          onComplete={onComplete}
        />
      )
    case 'sorting':
      return <Sorting items={activity.sortingItems ?? []} onComplete={onComplete} />
    case 'fillblank':
      return <FillBlank blanks={activity.blanks ?? []} onComplete={onComplete} />
    default:
      return <p className="text-secondary-600">نوع النشاط غير مدعوم.</p>
  }
}
