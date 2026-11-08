/** Normalization for values returned by page-side extraction scripts. */

const MAX_CAPTURE_LENGTH = 200_000
const MAX_PREVIEW_LENGTH = 1200

/** Turn an arbitrary `executeJavaScript` result into bounded plain text. */
export function normalizeCapture(raw: unknown): string {
  let text = ''
  if (typeof raw === 'string') {
    text = raw
  } else if (raw !== null && typeof raw === 'object') {
    const record = raw as Record<string, unknown>
    if (typeof record.text === 'string') text = record.text
  }
  if (text === '') return ''

  text = text
    .replace(/\u200b/gu, '')
    .replace(/\r\n/gu, '\n')
    .replace(/\r/gu, '\n')
    .replace(/\n{4,}/gu, '\n\n\n')
    .trim()

  if (text.length > MAX_CAPTURE_LENGTH) text = text.slice(0, MAX_CAPTURE_LENGTH)
  return text
}

/** A short preview for the floating card; the full text stays available for insert. */
export function previewText(text: string, max = MAX_PREVIEW_LENGTH): string {
  const normalized = text.trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max).trimEnd()}…`
}

/** Number of non-empty lines, used to decide whether a capture is meaningful. */
export function lineCount(text: string): number {
  return text.split('\n').filter((line) => line.trim() !== '').length
}
