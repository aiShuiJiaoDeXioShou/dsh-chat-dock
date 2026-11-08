import * as React from 'react'

import type { CapturedReply, ChatDockSettings, ConsoleUiState } from '../shared/types.js'
import { previewText } from '../shared/extract.js'
import { formatClock } from '../shared/format.js'
import { clampConsoleState, clampRect, defaultBounds, pillRect, type Viewport } from '../shared/geometry.js'
import { localized, pickSite, resolveSites } from '../shared/sites.js'
import {
  clearPluginStorage,
  defaultSettings,
  loadConsoleState,
  loadSettings,
  sanitizeSettings,
  saveConsoleState,
  saveSettings,
  type StorageLike,
} from '../shared/settings.js'
import { captureLatest } from './capture.js'
import type { CaptureResult } from './capture.js'
import { insertIntoComposer } from './bridge.js'
import { copyText } from './clipboard.js'
import { consoleEvents } from './events.js'
import type { ConsoleNotice } from './events.js'
import { floatActive, getSidebarRight, openSideUi, openSite } from './floating.js'
import type { ServiceGetter } from './floating.js'
import { ChatGlyph, CloseGlyph, CollapseGlyph, CopyGlyph, GearGlyph, InsertGlyph, RefreshGlyph } from './icons.js'
import type { Translate } from './locale.js'
import { SettingsView } from './settings-view.js'

export interface ConsoleProps {
  t: Translate
  services: ServiceGetter
  storage: StorageLike | undefined
}

type MirrorState = 'idle' | 'found' | 'empty' | 'missing' | 'error'

interface Mirror {
  state: MirrorState
  error?: string
}

interface GestureState {
  mode: 'drag' | 'resize'
  startX: number
  startY: number
  origin: { x: number; y: number; width: number; height: number }
  last?: { x: number; y: number; width: number; height: number }
}

function viewSize(): Viewport {
  return { width: window.innerWidth, height: window.innerHeight }
}

function language(): string {
  try {
    return document.documentElement.lang || navigator.language || 'en'
  } catch {
    return 'en'
  }
}

function dotState(mirror: Mirror): string {
  return mirror.state === 'missing' ? 'idle' : mirror.state
}

export function Console(props: ConsoleProps): React.ReactElement | null {
  const { t, services, storage } = props

  const [settings, setSettings] = React.useState<ChatDockSettings>(() => loadSettings(storage))
  const sites = React.useMemo(() => resolveSites(settings), [settings])
  const [siteId, setSiteId] = React.useState<string>(() => pickSite(sites, settings.defaultSite)?.id ?? '')
  const site = React.useMemo(() => pickSite(sites, siteId), [sites, siteId])
  const siteIdRef = React.useRef<string | undefined>(site?.id)

  const [viewport, setViewport] = React.useState<Viewport>(() => viewSize())
  const [ui, setUi] = React.useState<ConsoleUiState>(() => loadConsoleState(storage, viewSize()))
  const [mirror, setMirror] = React.useState<Mirror>({ state: 'idle' })
  const [capture, setCapture] = React.useState<CapturedReply | undefined>(undefined)
  const [busy, setBusy] = React.useState(false)
  const [status, setStatus] = React.useState<ConsoleNotice | undefined>(undefined)
  const [showSettings, setShowSettings] = React.useState(false)

  const statusTimer = React.useRef<number | undefined>(undefined)
  const gestureRef = React.useRef<GestureState | undefined>(undefined)

  const showStatus = React.useCallback((notice: ConsoleNotice): void => {
    setStatus(notice)
    if (statusTimer.current !== undefined) window.clearTimeout(statusTimer.current)
    statusTimer.current = window.setTimeout(() => {
      setStatus(undefined)
      statusTimer.current = undefined
    }, 4500)
  }, [])

  React.useEffect(() => {
    return () => {
      if (statusTimer.current !== undefined) window.clearTimeout(statusTimer.current)
    }
  }, [])

  const updateSettings = React.useCallback(
    (next: ChatDockSettings): void => {
      const sanitized = sanitizeSettings(next)
      setSettings(sanitized)
      saveSettings(storage, sanitized)
    },
    [storage],
  )

  const updateUi = React.useCallback(
    (next: ConsoleUiState): void => {
      setUi(next)
      saveConsoleState(storage, next)
    },
    [storage],
  )

  React.useEffect(() => {
    const next = pickSite(sites, siteId)
    if (next !== undefined && next.id !== siteId) setSiteId(next.id)
  }, [sites, siteId])

  React.useEffect(() => {
    siteIdRef.current = site?.id
  }, [site?.id])

  React.useEffect(() => {
    setCapture(undefined)
    setMirror({ state: 'idle' })
  }, [site?.id])

  React.useEffect(() => {
    const onResize = (): void => setViewport(viewSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  React.useEffect(() => {
    setUi((previous) => clampConsoleState(previous, viewport))
  }, [viewport])

  React.useEffect(() => {
    return consoleEvents.subscribe((event) => {
      if (event.type === 'toggle') {
        setUi((previous) => {
          const next = { ...previous, hidden: !previous.hidden, collapsed: previous.hidden ? false : previous.collapsed }
          saveConsoleState(storage, next)
          return next
        })
        return
      }
      setUi((previous) => {
        const next = { ...previous, hidden: false, collapsed: false }
        saveConsoleState(storage, next)
        return next
      })
      if (event.notice !== undefined) showStatus(event.notice)
    })
  }, [showStatus, storage])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.altKey && event.shiftKey && event.code === 'KeyC') {
        event.preventDefault()
        consoleEvents.toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const refresh = React.useCallback(async (): Promise<CaptureResult | undefined> => {
    if (site === undefined) return undefined
    const result = await captureLatest(site)
    if (siteIdRef.current !== site.id) return result
    if (result.ok) {
      setCapture({
        siteId: site.id,
        text: result.text,
        capturedAt: Date.now(),
        title: result.title !== '' ? result.title : undefined,
        url: result.url !== '' ? result.url : undefined,
      })
      setMirror({ state: 'found' })
    } else if (result.reason === 'no-page') {
      setCapture(undefined)
      setMirror({ state: 'missing' })
    } else if (result.reason === 'empty') {
      setCapture(undefined)
      setMirror({ state: 'empty' })
    } else {
      setMirror({ state: 'error', error: result.error ?? result.reason })
    }
    return result
  }, [site])

  React.useEffect(() => {
    if (ui.hidden || ui.collapsed || !settings.mirror || site === undefined) return
    let cancelled = false
    let inFlight = false
    const tick = async (): Promise<void> => {
      if (cancelled || inFlight || document.hidden) return
      inFlight = true
      try {
        await refresh()
      } finally {
        inFlight = false
      }
    }
    void tick()
    const timer = window.setInterval(() => {
      void tick()
    }, Math.max(1500, settings.intervalMs))
    const onVisibility = (): void => {
      if (!document.hidden) void tick()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ui.hidden, ui.collapsed, settings.mirror, settings.intervalMs, refresh, site])

  const nav = (): ReturnType<typeof getSidebarRight> => getSidebarRight(services)

  const open = (mode: 'docked' | 'float'): void => {
    if (site === undefined) {
      showStatus({ kind: 'warn', text: t('status.noSite') })
      return
    }
    const outcome = openSite(nav(), site, mode)
    if (!outcome.ok) {
      showStatus({
        kind: 'error',
        text: outcome.reason === 'unavailable' ? t('status.noSidebar') : t('status.openFailed'),
      })
      return
    }
    showStatus({
      kind: 'success',
      text: mode === 'float' && !outcome.floated ? t('status.floatManual') : t('status.opened'),
    })
  }

  const copy = async (): Promise<void> => {
    if (capture === undefined) return
    const ok = await copyText(capture.text)
    showStatus({ kind: ok ? 'success' : 'error', text: t(ok ? 'status.copied' : 'status.copyFailed') })
  }

  const insert = async (): Promise<void> => {
    if (capture === undefined) return
    const result = insertIntoComposer(capture.text)
    if (result === 'inserted') {
      showStatus({ kind: 'success', text: t('status.inserted') })
      return
    }
    const copied = await copyText(capture.text)
    showStatus({
      kind: 'warn',
      text: t(copied ? 'status.insertUnavailable' : 'status.copyFailed'),
    })
  }

  const manualCapture = async (): Promise<void> => {
    if (site === undefined) return
    setBusy(true)
    const result = await refresh()
    setBusy(false)
    if (result === undefined) return
    if (result.ok) {
      showStatus({ kind: 'success', text: t('status.captureDone') })
    } else if (result.reason === 'empty') {
      showStatus({ kind: 'warn', text: t('status.captureEmpty') })
    } else {
      showStatus({ kind: 'error', text: t('status.captureFailed') })
    }
  }

  const floatCurrent = (): void => {
    const ok = floatActive(nav())
    showStatus({ kind: ok ? 'success' : 'warn', text: t(ok ? 'status.floatDone' : 'status.floatFailed') })
  }

  const openKind = (kind: string): void => {
    const ok = openSideUi(nav(), kind)
    showStatus({
      kind: ok ? 'success' : 'error',
      text: t(ok ? 'status.sideOpened' : 'status.sideFailed', { kind: t(`console.${kind}`) }),
    })
  }

  const reset = (): void => {
    clearPluginStorage(storage)
    const nextSettings = defaultSettings()
    const nextUi: ConsoleUiState = { bounds: defaultBounds(viewSize()), collapsed: false, hidden: false }
    setSettings(nextSettings)
    setUi(nextUi)
    saveConsoleState(storage, nextUi)
    setShowSettings(false)
    showStatus({ kind: 'success', text: t('settings.saved') })
  }

  const expand = (): void => updateUi({ ...ui, hidden: false, collapsed: false })
  const collapse = (): void => updateUi({ ...ui, collapsed: true })
  const hide = (): void => updateUi({ ...ui, hidden: true })

  const beginGesture = (event: React.PointerEvent<HTMLElement>, mode: 'drag' | 'resize'): void => {
    if (event.button !== 0) return
    if (mode === 'drag') {
      const target = event.target as HTMLElement
      if (target.closest('button, input, select, textarea, a, label') !== null) return
    }
    event.preventDefault()
    const origin = ui.bounds
    const gesture: GestureState = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...origin },
    }
    gestureRef.current = gesture

    const onMove = (moveEvent: PointerEvent): void => {
      const current = gestureRef.current
      if (current === undefined) return
      const dx = moveEvent.clientX - current.startX
      const dy = moveEvent.clientY - current.startY
      const next =
        current.mode === 'drag'
          ? clampRect({ ...current.origin, x: current.origin.x + dx, y: current.origin.y + dy }, viewSize())
          : clampRect(
              {
                ...current.origin,
                width: current.origin.width + dx,
                height: current.origin.height + dy,
              },
              viewSize(),
            )
      current.last = next
      setUi((previous) => ({ ...previous, bounds: next }))
    }

    const onUp = (): void => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      const current = gestureRef.current
      gestureRef.current = undefined
      if (current === undefined || current.last === undefined) return
      const next = { ...ui, bounds: current.last }
      setUi(next)
      saveConsoleState(storage, next)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  if (ui.hidden) return null

  const siteLabel = site === undefined ? '' : localized(site.label, language())
  const mirrorHint = ((): string => {
    if (site === undefined) return t('settings.needSite')
    if (mirror.state === 'missing') return t('mirror.missing', { site: siteLabel })
    if (mirror.state === 'empty') return t('mirror.empty')
    if (mirror.state === 'error') return t('mirror.error', { error: mirror.error ?? 'error' })
    if (mirror.state === 'idle') return t('mirror.idle')
    return capture === undefined ? t('mirror.waiting') : ''
  })()

  if (ui.collapsed) {
    const pill = pillRect(ui.bounds, viewport)
    return (
      <div className="dsh-chat-dock-root">
        <button
          type="button"
          className="dsh-chat-dock-pill"
          style={{ left: pill.x, top: pill.y, width: pill.width, height: pill.height }}
          onClick={expand}
          title={t('console.expand')}
          aria-label={t('console.expand')}
        >
          <ChatGlyph size={20} />
          <span className="dsh-chat-dock-pill-dot" data-state={dotState(mirror)} />
        </button>
      </div>
    )
  }

  return (
    <div className="dsh-chat-dock-root">
      <div
        className="dsh-chat-dock-panel"
        style={{ left: ui.bounds.x, top: ui.bounds.y, width: ui.bounds.width, height: ui.bounds.height }}
        role="region"
        aria-label={t('console.title')}
      >
        <header className="dsh-chat-dock-header" onPointerDown={(event) => beginGesture(event, 'drag')}>
          <span className="dsh-chat-dock-dot" data-state={dotState(mirror)} />
          <span className="dsh-chat-dock-title">{t('console.title')}</span>
          <span className="dsh-chat-dock-site-name">{siteLabel}</span>
          <button
            type="button"
            className="dsh-chat-dock-icon-btn"
            onClick={() => setShowSettings((value) => !value)}
            title={t('console.settings')}
            aria-label={t('console.settings')}
            aria-pressed={showSettings}
          >
            <GearGlyph />
          </button>
          <button
            type="button"
            className="dsh-chat-dock-icon-btn"
            onClick={collapse}
            title={t('console.collapse')}
            aria-label={t('console.collapse')}
          >
            <CollapseGlyph />
          </button>
          <button
            type="button"
            className="dsh-chat-dock-icon-btn"
            onClick={hide}
            title={t('console.hide')}
            aria-label={t('console.hide')}
          >
            <CloseGlyph />
          </button>
        </header>

        <div className="dsh-chat-dock-body">
          {showSettings ? (
            <SettingsView
              t={t}
              settings={settings}
              enabledSites={sites}
              onChange={updateSettings}
              onReset={reset}
              onClose={() => setShowSettings(false)}
            />
          ) : (
            <>
              <div className="dsh-chat-dock-row">
                {sites.length === 0 ? (
                  <span className="dsh-chat-dock-hint">{t('settings.needSite')}</span>
                ) : (
                  <select
                    className="dsh-chat-dock-select"
                    value={site?.id ?? ''}
                    onChange={(event) => setSiteId(event.target.value)}
                    aria-label={t('console.site')}
                    title={t('console.site')}
                  >
                    {sites.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {localized(entry.label, language())}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  className="dsh-chat-dock-btn"
                  data-variant="primary"
                  disabled={site === undefined}
                  onClick={() => open(settings.openMode)}
                >
                  {t('console.open')}
                </button>
                <button
                  type="button"
                  className="dsh-chat-dock-btn"
                  disabled={site === undefined}
                  onClick={() => open('float')}
                >
                  {t('console.float')}
                </button>
              </div>

              <div className="dsh-chat-dock-mirror">
                <div className="dsh-chat-dock-mirror-head">
                  <span>{t('console.latest')}</span>
                  <span>{capture === undefined ? '' : formatClock(capture.capturedAt)}</span>
                </div>
                <div className="dsh-chat-dock-mirror-body">
                  {capture === undefined ? (
                    <div className="dsh-chat-dock-hint">{mirrorHint}</div>
                  ) : (
                    <pre>{previewText(capture.text, 4000)}</pre>
                  )}
                </div>
              </div>

              <div className="dsh-chat-dock-actions">
                <button
                  type="button"
                  className="dsh-chat-dock-btn"
                  onClick={() => void manualCapture()}
                  disabled={busy || site === undefined}
                  title={t('console.captureHint')}
                >
                  <RefreshGlyph size={13} />
                  {busy ? '…' : t('console.capture')}
                </button>
                <button
                  type="button"
                  className="dsh-chat-dock-btn"
                  onClick={() => void copy()}
                  disabled={capture === undefined}
                  title={t('console.copyHint')}
                >
                  <CopyGlyph size={13} />
                  {t('console.copy')}
                </button>
                <button
                  type="button"
                  className="dsh-chat-dock-btn"
                  onClick={() => void insert()}
                  disabled={capture === undefined}
                  title={t('console.insertHint')}
                >
                  <InsertGlyph size={13} />
                  {t('console.insert')}
                </button>
              </div>

              <div className="dsh-chat-dock-status" data-kind={status?.kind ?? 'info'} aria-live="polite">
                {status?.text ?? ''}
              </div>

              <div className="dsh-chat-dock-side">
                <span className="dsh-chat-dock-side-label">{t('console.sidebar')}</span>
                <button type="button" className="dsh-chat-dock-btn" onClick={() => openKind('files')}>
                  {t('console.files')}
                </button>
                <button type="button" className="dsh-chat-dock-btn" onClick={() => openKind('terminal')}>
                  {t('console.terminal')}
                </button>
                <button type="button" className="dsh-chat-dock-btn" onClick={() => openKind('browser')}>
                  {t('console.browser')}
                </button>
                <button type="button" className="dsh-chat-dock-btn" onClick={floatCurrent}>
                  {t('console.floatCurrent')}
                </button>
              </div>

              <div className="dsh-chat-dock-foot">{t('console.limits')}</div>
            </>
          )}
        </div>

        <div className="dsh-chat-dock-resize" onPointerDown={(event) => beginGesture(event, 'resize')} />
      </div>
    </div>
  )
}
