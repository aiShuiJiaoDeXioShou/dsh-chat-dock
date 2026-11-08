/** Versioned local settings and console geometry. */

import type { ChatDockSettings, ConsoleUiState, CustomSiteInput, SiteOverride } from './types.js'
import type { Viewport } from './geometry.js'
import { clampConsoleState, defaultBounds, isConsoleRect } from './geometry.js'
import { hostFromUrl, isHttpUrl, normalizeHost } from './sites.js'

export const SETTINGS_KEY = 'dsh-chat-dock.v1.settings'
export const CONSOLE_KEY = 'dsh-chat-dock.v1.console'
export const SETTINGS_VERSION = 1
export const MIN_INTERVAL_MS = 1500
export const MAX_INTERVAL_MS = 60_000
export const MAX_CUSTOM_SITES = 20

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function defaultSettings(): ChatDockSettings {
  return {
    version: SETTINGS_VERSION,
    defaultSite: 'deepseek',
    openMode: 'docked',
    mirror: true,
    intervalMs: 2500,
    overrides: {},
    customSites: [],
  }
}

function recordOf(value: unknown): Record<string, unknown> | undefined {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

function sanitizeOverride(value: unknown): SiteOverride | undefined {
  const record = recordOf(value)
  if (record === undefined) return undefined
  const override: SiteOverride = {}
  if (typeof record.enabled === 'boolean') override.enabled = record.enabled
  if (typeof record.url === 'string' && isHttpUrl(record.url)) override.url = record.url
  if (typeof record.latestReply === 'string' && record.latestReply.trim() !== '') {
    override.latestReply = record.latestReply
  }
  return override
}

function sanitizeCustomSite(value: unknown): CustomSiteInput | undefined {
  const record = recordOf(value)
  if (record === undefined) return undefined
  const id = typeof record.id === 'string' ? record.id.trim() : ''
  const label = typeof record.label === 'string' ? record.label.trim() : ''
  const url = typeof record.url === 'string' ? record.url.trim() : ''
  if (!id || id.length > 48 || !label || label.length > 64 || !isHttpUrl(url)) return undefined
  const hosts =
    Array.isArray(record.hosts) && record.hosts.length > 0
      ? record.hosts.filter((host): host is string => typeof host === 'string').map(normalizeHost).filter(Boolean)
      : []
  const latestReply = typeof record.latestReply === 'string' && record.latestReply.trim() !== '' ? record.latestReply : undefined
  return {
    id,
    label,
    url,
    ...(hosts.length > 0 ? { hosts } : {}),
    ...(latestReply !== undefined ? { latestReply } : {}),
    enabled: record.enabled !== false,
  }
}

/** Migrate and validate any stored/unknown value into complete settings. */
export function sanitizeSettings(value: unknown): ChatDockSettings {
  const defaults = defaultSettings()
  const record = recordOf(value)
  if (record === undefined) return defaults

  const defaultSite = typeof record.defaultSite === 'string' && record.defaultSite.trim() !== '' ? record.defaultSite : defaults.defaultSite
  const openMode = record.openMode === 'float' ? 'float' : 'docked'
  const mirror = typeof record.mirror === 'boolean' ? record.mirror : defaults.mirror
  const rawInterval = typeof record.intervalMs === 'number' && Number.isFinite(record.intervalMs) ? record.intervalMs : defaults.intervalMs
  const intervalMs = Math.min(Math.max(Math.round(rawInterval), MIN_INTERVAL_MS), MAX_INTERVAL_MS)

  const overrides: Record<string, SiteOverride> = {}
  const rawOverrides = recordOf(record.overrides)
  if (rawOverrides !== undefined) {
    for (const [key, raw] of Object.entries(rawOverrides)) {
      const override = sanitizeOverride(raw)
      if (override !== undefined) overrides[key] = override
    }
  }

  const customSites: CustomSiteInput[] = []
  if (Array.isArray(record.customSites)) {
    for (const raw of record.customSites.slice(0, MAX_CUSTOM_SITES)) {
      const site = sanitizeCustomSite(raw)
      if (site !== undefined) customSites.push(site)
    }
  }

  return { version: SETTINGS_VERSION, defaultSite, openMode, mirror, intervalMs, overrides, customSites }
}

export function loadSettings(storage: StorageLike | undefined): ChatDockSettings {
  if (storage === undefined) return defaultSettings()
  try {
    const raw = storage.getItem(SETTINGS_KEY)
    if (raw === null || raw === '') return defaultSettings()
    return sanitizeSettings(JSON.parse(raw))
  } catch {
    return defaultSettings()
  }
}

export function saveSettings(storage: StorageLike | undefined, settings: ChatDockSettings): void {
  if (storage === undefined) return
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(sanitizeSettings(settings)))
  } catch {
    /* storage can be unavailable or full; the in-memory settings still work */
  }
}

export function loadConsoleState(storage: StorageLike | undefined, viewport: Viewport): ConsoleUiState {
  const fallback: ConsoleUiState = { bounds: defaultBounds(viewport), collapsed: false, hidden: false }
  if (storage === undefined) return fallback
  try {
    const raw = storage.getItem(CONSOLE_KEY)
    if (raw === null || raw === '') return fallback
    const parsed = recordOf(JSON.parse(raw))
    if (parsed === undefined) return fallback
    const bounds = isConsoleRect(parsed.bounds) ? parsed.bounds : fallback.bounds
    return clampConsoleState(
      {
        bounds,
        collapsed: parsed.collapsed === true,
        hidden: parsed.hidden === true,
      },
      viewport,
    )
  } catch {
    return fallback
  }
}

export function saveConsoleState(storage: StorageLike | undefined, state: ConsoleUiState): void {
  if (storage === undefined) return
  try {
    storage.setItem(CONSOLE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

export function clearPluginStorage(storage: StorageLike | undefined): void {
  if (storage === undefined) return
  try {
    storage.removeItem(SETTINGS_KEY)
    storage.removeItem(CONSOLE_KEY)
  } catch {
    /* ignore */
  }
}

export interface ParsedCustomSites {
  sites: CustomSiteInput[]
  error?: string
}

/**
 * Parse the advanced custom-site JSON. Strict: one invalid entry rejects the
 * whole input, so a typo cannot silently remove a site.
 */
export function parseCustomSites(text: string): ParsedCustomSites {
  const trimmed = text.trim()
  if (trimmed === '') return { sites: [] }
  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    return { sites: [], error: 'Invalid JSON.' }
  }
  if (!Array.isArray(parsed)) return { sites: [], error: 'Expected a JSON array.' }
  if (parsed.length > MAX_CUSTOM_SITES) return { sites: [], error: `At most ${MAX_CUSTOM_SITES} custom sites are allowed.` }

  const sites: CustomSiteInput[] = []
  const seen = new Set<string>()
  for (const [index, raw] of parsed.entries()) {
    const site = sanitizeCustomSite(raw)
    if (site === undefined) {
      return { sites: [], error: `Entry ${index + 1} needs an id, a label and an http(s) url.` }
    }
    if (seen.has(site.id)) return { sites: [], error: `Duplicate site id "${site.id}".` }
    if (site.hosts === undefined && hostFromUrl(site.url) === undefined) {
      return { sites: [], error: `Entry ${index + 1} has an invalid url.` }
    }
    seen.add(site.id)
    sites.push(site)
  }
  return { sites }
}
