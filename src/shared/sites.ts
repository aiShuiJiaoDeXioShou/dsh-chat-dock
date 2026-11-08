/**
 * Built-in web-chat site adapters.
 *
 * Everything here is plain data plus self-contained page functions. A page
 * function is serialized with `pageScript()` and passed to
 * `webview.executeJavaScript`, so it may only use browser globals and must not
 * reference imports, TypeScript helpers, or closures.
 */

import type { ChatDockSettings, CustomSiteInput, LocalizedText, WebChatSite } from './types.js'

export const DEEPSEEK_URL = 'https://chat.deepseek.com/'
export const CHATGPT_URL = 'https://chatgpt.com/'
export const CLAUDE_URL = 'https://claude.ai/'

/** Serialize a self-contained page function into an immediately invoked source string. */
export function pageScript(fn: () => string): string {
  return `(${fn.toString()})()`
}

/**
 * DeepSeek Chat: assistant replies render their Markdown inside `.ds-markdown`.
 * The fallback chain keeps this usable when the hashed wrapper changes.
 */
export function extractDeepSeekLatest(): string {
  function visible(element: Element): boolean {
    const maybe = element as HTMLElement & {
      checkVisibility?: (options?: { checkOpacity?: boolean; checkVisibilityCSS?: boolean }) => boolean
    }
    if (typeof maybe.checkVisibility === 'function') {
      try {
        if (!maybe.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true })) return false
      } catch {
        /* optional API */
      }
    }
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }
  const nodes: Element[] = []
  for (const selector of ['.ds-markdown', '[class*="ds-markdown"]', '[class*="markdown"]']) {
    for (const node of Array.from(document.querySelectorAll(selector))) {
      if (visible(node)) nodes.push(node)
    }
  }
  if (nodes.length > 0) {
    const top = nodes.filter((node) => !nodes.some((other) => other !== node && other.contains(node)))
    const last = top[top.length - 1] ?? nodes[nodes.length - 1]
    const text = (last as HTMLElement).innerText ?? last.textContent ?? ''
    if (text.trim()) return text
  }
  const selection = typeof window.getSelection === 'function' ? String(window.getSelection() ?? '') : ''
  return selection.trim() ? selection : ''
}

/** ChatGPT: one container per assistant turn. Experimental (deferred default). */
export function extractChatGPTLatest(): string {
  function visible(element: Element): boolean {
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }
  const candidates = Array.from(
    document.querySelectorAll('[data-message-author-role="assistant"]'),
  ).filter(visible)
  const last = candidates[candidates.length - 1]
  if (last !== undefined) {
    const node = last.querySelector('.markdown, [class*="markdown"]') ?? last
    const text = (node as HTMLElement).innerText ?? node.textContent
    if (typeof text === 'string' && text.trim()) return text
  }
  const selection = typeof window.getSelection === 'function' ? String(window.getSelection() ?? '') : ''
  return selection.trim() ? selection : ''
}

/** Claude: best-effort assistant message container. Experimental (deferred default). */
export function extractClaudeLatest(): string {
  function visible(element: Element): boolean {
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }
  const candidates = Array.from(
    document.querySelectorAll('.font-claude-message, [data-testid="chat-message"], [data-testid*="message"]'),
  ).filter(visible)
  const last = candidates[candidates.length - 1]
  if (last !== undefined) {
    const text = (last as HTMLElement).innerText ?? last.textContent
    if (typeof text === 'string' && text.trim()) return text
  }
  const selection = typeof window.getSelection === 'function' ? String(window.getSelection() ?? '') : ''
  return selection.trim() ? selection : ''
}

/**
 * Generic fallback for custom sites: the current selection, otherwise the tail
 * of the page's visible text. It is deliberately noisy; a custom site should
 * provide its own script.
 */
export function extractGenericLatest(): string {
  const selection = typeof window.getSelection === 'function' ? String(window.getSelection() ?? '') : ''
  if (selection.trim()) return selection
  const body = document.body
  if (body === null) return ''
  const text = body.innerText ?? ''
  return text.trim() ? text.slice(-12000) : ''
}

export const DEFAULT_SITES: readonly WebChatSite[] = [
  {
    id: 'deepseek',
    label: { en: 'DeepSeek Chat', zh: 'DeepSeek Chat' },
    url: DEEPSEEK_URL,
    hosts: ['chat.deepseek.com'],
    extraction: {
      latestReply: pageScript(extractDeepSeekLatest),
      conversation: pageScript(extractGenericLatest),
    },
    enabledByDefault: true,
  },
  {
    id: 'chatgpt',
    label: { en: 'ChatGPT', zh: 'ChatGPT' },
    url: CHATGPT_URL,
    hosts: ['chatgpt.com', 'chat.openai.com'],
    loginHint: {
      en: 'Sign in to ChatGPT in the Browser tab first. Some accounts or regions may block embedded browsers.',
      zh: '请先在 Browser 标签里登录 ChatGPT；部分账号或地区可能阻止内嵌浏览器。',
    },
    extraction: {
      latestReply: pageScript(extractChatGPTLatest),
      conversation: pageScript(extractGenericLatest),
    },
    enabledByDefault: false,
    experimental: true,
  },
  {
    id: 'claude',
    label: { en: 'Claude', zh: 'Claude' },
    url: CLAUDE_URL,
    hosts: ['claude.ai'],
    loginHint: {
      en: 'Sign in to Claude in the Browser tab first. Some accounts or regions may block embedded browsers.',
      zh: '请先在 Browser 标签里登录 Claude；部分账号或地区可能阻止内嵌浏览器。',
    },
    extraction: {
      latestReply: pageScript(extractClaudeLatest),
      conversation: pageScript(extractGenericLatest),
    },
    enabledByDefault: false,
    experimental: true,
  },
]

export const GENERIC_LATEST_SCRIPT = pageScript(extractGenericLatest)

/** Lowercase a host and strip protocol, path and a leading dot. */
export function normalizeHost(value: string): string {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return ''
  const withoutScheme = trimmed.replace(/^[a-z][a-z0-9+.-]*:\/\//u, '')
  const host = withoutScheme.split('/')[0]?.split('?')[0]?.split('#')[0] ?? ''
  return host.replace(/:\d+$/u, '').replace(/^\.+/u, '')
}

export function hostFromUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url)
    return parsed.hostname.toLowerCase()
  } catch {
    return undefined
  }
}

export function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function hostMatches(url: string, hosts: readonly string[]): boolean {
  const host = hostFromUrl(url)
  if (host === undefined) return false
  return hosts.some((candidate) => {
    const normalized = normalizeHost(candidate)
    return normalized !== '' && (host === normalized || host.endsWith(`.${normalized}`))
  })
}

export function matchSite(sites: readonly WebChatSite[], url: string): WebChatSite | undefined {
  return sites.find((site) => hostMatches(url, site.hosts))
}

export function siteById(sites: readonly WebChatSite[], id: string): WebChatSite | undefined {
  return sites.find((site) => site.id === id)
}

export function localized(text: LocalizedText, locale: string): string {
  return locale.toLowerCase().startsWith('zh') ? text.zh : text.en
}

function customSite(input: CustomSiteInput): WebChatSite | undefined {
  const id = input.id.trim()
  const label = input.label.trim()
  if (!id || !label || !isHttpUrl(input.url)) return undefined
  const hosts =
    Array.isArray(input.hosts) && input.hosts.length > 0
      ? input.hosts.map(normalizeHost).filter(Boolean)
      : [hostFromUrl(input.url) ?? ''].filter(Boolean)
  if (hosts.length === 0) return undefined
  return {
    id: `custom:${id}`,
    label: { en: label, zh: label },
    url: input.url,
    hosts,
    extraction: {
      latestReply: input.latestReply?.trim() ? input.latestReply : GENERIC_LATEST_SCRIPT,
      conversation: GENERIC_LATEST_SCRIPT,
    },
    enabledByDefault: input.enabled !== false,
  }
}

/**
 * Merge built-in sites, per-site overrides and user-added custom sites.
 * Returns only the sites the user has enabled, in stable order.
 */
export function resolveSites(settings: ChatDockSettings): WebChatSite[] {
  const result: WebChatSite[] = []
  const seen = new Set<string>()
  for (const base of DEFAULT_SITES) {
    const override = settings.overrides[base.id]
    const enabled = override?.enabled ?? base.enabledByDefault
    if (!enabled) continue
    const url = override?.url !== undefined && isHttpUrl(override.url) ? override.url : base.url
    result.push({
      ...base,
      url,
      extraction: {
        ...base.extraction,
        ...(override?.latestReply?.trim() ? { latestReply: override.latestReply } : {}),
      },
    })
    seen.add(base.id)
  }
  const baseIds = new Set(DEFAULT_SITES.map((site) => site.id))
  for (const input of settings.customSites) {
    if (input.enabled === false) continue
    if (baseIds.has(input.id.trim())) continue
    const site = customSite(input)
    if (site === undefined || seen.has(site.id)) continue
    result.push(site)
    seen.add(site.id)
  }
  return result
}

/** Pick the requested default site, otherwise the first enabled site. */
export function pickSite(sites: readonly WebChatSite[], requested: string): WebChatSite | undefined {
  return siteById(sites, requested) ?? sites[0]
}
