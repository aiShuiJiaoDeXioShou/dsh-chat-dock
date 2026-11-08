/** Open a Chat site in the built-in Sidebar Browser and optionally float it. */

import type { WebChatSite } from '../shared/types.js'
import { isViewVisible, pickView } from './capture.js'

export interface SidebarRightTabInfo {
  id?: unknown
  kind?: unknown
}

/** Structural face of the public `ctx.sidebarRight` controller. */
export interface SidebarRightFace {
  openTab?(kind: string, options?: Record<string, unknown>): unknown
  active?(): SidebarRightTabInfo | undefined | null
  float?(tabId: string, rect?: unknown): unknown
  focus?(tabId: string): unknown
}

export interface ServiceGetter {
  get(name: string): unknown
}

export function getSidebarRight(services: ServiceGetter): SidebarRightFace | undefined {
  try {
    const value = services.get('sidebarRight')
    return value !== null && typeof value === 'object' ? (value as SidebarRightFace) : undefined
  } catch {
    return undefined
  }
}

export type OpenFailureReason = 'unavailable' | 'error'

export interface OpenOutcome {
  ok: boolean
  floated: boolean
  reason?: OpenFailureReason
  error?: string
}

function activeTabId(nav: SidebarRightFace): string | undefined {
  try {
    const tab = nav.active?.()
    return tab !== null && tab !== undefined && typeof tab.id === 'string' ? tab.id : undefined
  } catch {
    return undefined
  }
}

function tryFloat(nav: SidebarRightFace, site: WebChatSite): boolean {
  if (typeof nav.float !== 'function') return false
  const view = pickView(site)
  if (view === undefined || !isViewVisible(view)) return false
  const tabId = activeTabId(nav)
  if (tabId === undefined) return false
  try {
    nav.float(tabId)
    return true
  } catch {
    return false
  }
}

function scheduleFloatRetries(nav: SidebarRightFace, site: WebChatSite, attempt = 0): void {
  if (attempt >= 4) return
  setTimeout(() => {
    if (!tryFloat(nav, site)) scheduleFloatRetries(nav, site, attempt + 1)
  }, 180 + attempt * 220)
}

/**
 * Open the site in a Browser tab. Deduplication, expansion and focusing are the
 * dockkit's business; floating happens after the new tab is active.
 */
export function openSite(
  nav: SidebarRightFace | undefined,
  site: WebChatSite,
  mode: 'docked' | 'float',
): OpenOutcome {
  if (nav === undefined || typeof nav.openTab !== 'function') {
    return { ok: false, floated: false, reason: 'unavailable' }
  }
  try {
    nav.openTab('browser', { params: { url: site.url } })
  } catch (error) {
    return { ok: false, floated: false, reason: 'error', error: error instanceof Error ? error.message : String(error) }
  }
  if (mode !== 'float') return { ok: true, floated: false }
  const floated = tryFloat(nav, site)
  if (!floated) scheduleFloatRetries(nav, site)
  return { ok: true, floated }
}

/** Float the currently active docked/floating tab (used by the console and tests). */
export function floatActive(nav: SidebarRightFace | undefined): boolean {
  if (nav === undefined || typeof nav.float !== 'function') return false
  const tabId = activeTabId(nav)
  if (tabId === undefined) return false
  try {
    nav.float(tabId)
    return true
  } catch {
    return false
  }
}

/** Open another built-in sidebar page (files, terminal, browser, …) by kind. */
export function openSideUi(nav: SidebarRightFace | undefined, kind: string): boolean {
  if (nav === undefined || typeof nav.openTab !== 'function' || !kind) return false
  try {
    nav.openTab(kind)
    return true
  } catch {
    return false
  }
}
