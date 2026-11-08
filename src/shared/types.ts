/** Shared value types for the dsh-chat-dock client and tests. */

export interface LocalizedText {
  en: string
  zh: string
}

export interface SiteExtraction {
  /** Page-side JavaScript source. Runs in the guest page and returns a string. */
  latestReply: string
  /** Optional page-side source returning the whole visible conversation. */
  conversation?: string
  /** Optional page-side source returning whether the user appears signed in. */
  loggedIn?: string
}

export interface WebChatSite {
  id: string
  label: LocalizedText
  url: string
  hosts: readonly string[]
  loginHint?: LocalizedText
  extraction: SiteExtraction
  /** Enabled unless the user explicitly turns it off. */
  enabledByDefault: boolean
  /** Best-effort adapter; the site may change or block embedded browsers. */
  experimental?: boolean
}

export interface CustomSiteInput {
  id: string
  label: string
  url: string
  hosts?: string[]
  latestReply?: string
  enabled?: boolean
}

export interface SiteOverride {
  enabled?: boolean
  url?: string
  latestReply?: string
}

export interface ChatDockSettings {
  version: 1
  defaultSite: string
  openMode: 'docked' | 'float'
  mirror: boolean
  intervalMs: number
  overrides: Record<string, SiteOverride>
  customSites: CustomSiteInput[]
}

export interface ConsoleRect {
  x: number
  y: number
  width: number
  height: number
}

export interface ConsoleUiState {
  bounds: ConsoleRect
  collapsed: boolean
  hidden: boolean
}

export interface CapturedReply {
  siteId: string
  text: string
  capturedAt: number
  title?: string
  url?: string
}
