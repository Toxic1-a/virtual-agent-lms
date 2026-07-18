/** Prefix public asset paths with Vite BASE_URL (needed for GitHub Pages). */
export function assetUrl(path: string): string {
  if (!path) return path
  if (/^(https?:|data:|blob:)/i.test(path)) return path

  const base = import.meta.env.BASE_URL || '/'
  const normalized = path.startsWith('/') ? path.slice(1) : path
  return `${base}${normalized}`
}

/** True when a quiz/lesson value is an image path stored in JSON. */
export function isAssetPath(value: string): boolean {
  return value.startsWith('/images/') || value.startsWith('images/')
}
