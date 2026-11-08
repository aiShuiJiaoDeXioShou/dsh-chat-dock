/** Text prepared for the composer and small display helpers. */

/** Ensure one trailing newline so an inserted plan does not glue to existing text. */
export function insertionText(text: string): string {
  const normalized = text.replace(/\r\n/gu, '\n').replace(/[ \t]+$/gmu, '').trimEnd()
  if (normalized === '') return ''
  return `${normalized}\n`
}

export function formatClock(timestamp: number): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function shortHost(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}
