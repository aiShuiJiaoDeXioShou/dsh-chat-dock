/** Clipboard with an editor fallback for contexts without the async API. */

export async function copyText(text: string): Promise<boolean> {
  if (text === '') return false
  try {
    if (navigator.clipboard !== undefined && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the editor path */
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', 'readonly')
    area.style.position = 'fixed'
    area.style.top = '-1000px'
    area.style.left = '-1000px'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const copied = document.execCommand('copy')
    area.remove()
    return copied
  } catch {
    return false
  }
}
