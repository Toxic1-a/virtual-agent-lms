import type { AgentMood } from '../components/virtual-agent/agentCharacters'

export type AgentReactionKind =
  | 'greeting'
  | 'navigate'
  | 'button'
  | 'quiz-start'
  | 'correct'
  | 'incorrect'
  | 'section'
  | 'idle'
  | 'goodbye'
  | 'celebrating'

export interface AgentReaction {
  message: string
  mood: AgentMood
  holdMs: number
}

const IDLE_CUES = [
  'ما زلت هنا إن احتجت تلميحًا — جرّب النقر على زر أو متابعة الدرس.',
  'خذ نفَسًا ثم أكمل بخطوة صغيرة. أنا جاهز متى عدت.',
  'هل تريد تذكيرًا؟ افتح نشاطًا أو اختبارًا وسأشجّعك أثناءه.',
]

const NAV_CUES = [
  'صفحة جديدة — لنلقِ نظرة معًا على المحتوى.',
  'انتقال ناجح. ركّز على العنوان أولًا ثم التفاصيل.',
  'هنا قسم مختلف. سأتابع معك بهدوء.',
]

function pick<T>(items: T[], salt = Date.now()): T {
  return items[Math.abs(salt) % items.length]!
}

export function buildReaction(kind: AgentReactionKind, salt?: number): AgentReaction {
  switch (kind) {
    case 'greeting':
      return {
        message: 'أهلًا! أنا مساعدك التفاعلي — ابدأ بأي زر وسأردّ بتعبير ورسالة.',
        mood: 'greeting',
        holdMs: 9000,
      }
    case 'navigate':
      return {
        message: pick(NAV_CUES, salt),
        mood: 'pointing',
        holdMs: 5500,
      }
    case 'button':
      return {
        message: 'تمام! لمسة جيدة — لنكمل.',
        mood: 'happy',
        holdMs: 2200,
      }
    case 'quiz-start':
      return {
        message: 'جاهزون للتحقق؟ اقرأ السؤال بهدوء، وأنا أفكّر معك.',
        mood: 'think',
        holdMs: 8000,
      }
    case 'correct':
      return {
        message: 'أحسنت! إجابة صحيحة — استمر بهذا التركيز.',
        mood: 'celebrating',
        holdMs: 7000,
      }
    case 'incorrect':
      return {
        message: 'لا بأس، الخطأ جزء من التعلّم. راجع الفكرة وحاول مرة أخرى.',
        mood: 'encouraging',
        holdMs: 7500,
      }
    case 'section':
      return {
        message: 'انتقال داخل الصفحة — راقب الهدف الجديد لهذا القسم.',
        mood: 'explaining',
        holdMs: 4500,
      }
    case 'idle':
      return {
        message: pick(IDLE_CUES, salt),
        mood: 'idle',
        holdMs: 8000,
      }
    case 'goodbye':
      return {
        message: 'إلى اللقاء قريبًا — تقدّمك محفوظ ويمكنك المتابعة متى شئت.',
        mood: 'goodbye',
        holdMs: 6000,
      }
    case 'celebrating':
      return {
        message: 'إنجاز رائع! احتفل بلحظة ثم تابع بثقة.',
        mood: 'celebrating',
        holdMs: 7500,
      }
    default:
      return {
        message: 'أنا هنا لمساعدتك أثناء التعلم.',
        mood: 'idle',
        holdMs: 5000,
      }
  }
}

/**
 * Map high-level moods onto Rive booleans.
 * Glasses stay off: lens glare is baked into the .riv glasses artwork.
 */
export function moodToRiveExpression(mood: AgentMood): {
  glasses: boolean
  blush: boolean
} {
  switch (mood) {
    case 'talk':
    case 'explaining':
    case 'pointing':
    case 'think':
      return { glasses: false, blush: false }
    case 'happy':
    case 'greeting':
    case 'celebrating':
    case 'encouraging':
    case 'goodbye':
      return { glasses: false, blush: true }
    case 'idle':
    default:
      return { glasses: false, blush: false }
  }
}

export function moodLabelAr(mood: AgentMood): string {
  switch (mood) {
    case 'talk':
      return 'يتحدث'
    case 'happy':
      return 'سعيد'
    case 'think':
      return 'يفكر'
    case 'greeting':
      return 'ترحيب'
    case 'encouraging':
      return 'تشجيع'
    case 'pointing':
      return 'يشير'
    case 'explaining':
      return 'يشرح'
    case 'celebrating':
      return 'يحتفل'
    case 'goodbye':
      return 'وداع'
    case 'idle':
    default:
      return 'انتظار'
  }
}
