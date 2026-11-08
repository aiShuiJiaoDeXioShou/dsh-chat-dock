/**
 * Discovery of the built-in Sidebar Browser webviews and one-shot extraction.
 *
 * The Browser tab owns the guest and its lease; this plugin never creates a
 * webview. It only finds an already-attached `webview[data-sidebar-browser-frame]`
 * and asks it to run a self-contained extraction script.
 */

import type { WebChatSite } from '../shared/types.js'
import { normalizeCapture } from '../shared/extract.js'
import { hostMatches } from '../shared/sites.js'

/** Structural face of the Electron `<webview>` used by the Sidebar Browser. */
export interface BrowserViewLike {
  executeJavaScript?(code: string): Promise<unknown>
  getURL?(): string
  getTitle?(): string
  isConnected: boolean
  getBoundingClientRect(): DOMRect
}

export type CaptureFailureReason = 'no-page' | 'empty' | 'error' | 'timeout'

export interface CaptureSuccess {
  ok: true
  text: string
  url: string
  title: string
}

export interface CaptureFailure {
  ok: false
  reason: CaptureFailureReason
  error?: string
}

export type CaptureResult = CaptureSuccess | CaptureFailure

export function listBrowserViews(root: Document = document): BrowserViewLike[] {
  try {
    const nodes = root.querySelectorAll('webview[data-sidebar-browser-frame]')
    return Array.from(nodes) as unknown as BrowserViewLike[]
  } catch {
    return []
  }
}

export function viewUrl(view: BrowserViewLike): string {
  try {
    const value = view.getURL?.()
    return typeof value === 'string' ? value : ''
  } catch {
    return ''
  }
}

export function viewTitle(view: BrowserViewLike): string {
  try {
    const value = view.getTitle?.()
    return typeof value === 'string' ? value : ''
  } catch {
    return ''
  }
}

export function isViewVisible(view: BrowserViewLike): boolean {
  try {
    if (view.isConnected === false) return false
    const rect = view.getBoundingClientRect()
    return rect.width > 4 && rect.height > 4
  } catch {
    return false
  }
}

export function viewsForSite(site: WebChatSite, root: Document = document): BrowserViewLike[] {
  return listBrowserViews(root).filter((view) => hostMatches(viewUrl(view), site.hosts))
}

/** Prefer the visible Chat view; a background one is still readable via executeJavaScript. */
export function pickView(site: WebChatSite, root: Document = document): BrowserViewLike | undefined {
  const views = viewsForSite(site, root)
  return views.find(isViewVisible) ?? views[0]
}

export function hasSitePage(site: WebChatSite, root: Document = document): boolean {
  return viewsForSite(site, root).length > 0
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out after ${timeoutMs}ms`)), timeoutMs)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

export interface CaptureOptions {
  timeoutMs?: number
  root?: Document
}

/** Run the site adapter's latest-reply script and normalize its result. */
export async function captureLatest(site: WebChatSite, options: CaptureOptions = {}): Promise<CaptureResult> {
  const timeoutMs = options.timeoutMs ?? 4000
  const root = options.root ?? document
  const view = pickView(site, root)
  if (view === undefined) return { ok: false, reason: 'no-page' }
  if (typeof view.executeJavaScript !== 'function') return { ok: false, reason: 'error', error: 'webview cannot execute JavaScript' }

  let raw: unknown
  try {
    raw = await withTimeout(Promise.resolve(view.executeJavaScript(site.extraction.latestReply)), timeoutMs)
  } catch (error) {
    const message = errorMessage(error)
    return {
      ok: false,
      reason: /timed out/u.test(message) ? 'timeout' : 'error',
      error: message,
    }
  }

  const text = normalizeCapture(raw)
  if (text === '') return { ok: false, reason: 'empty' }
  return {
    ok: true,
    text,
    url: viewUrl(view),
    title: viewTitle(view),
  }
}
