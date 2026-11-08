import * as React from 'react'

import type { ChatDockSettings, WebChatSite } from '../shared/types.js'
import { DEFAULT_SITES } from '../shared/sites.js'
import { MAX_INTERVAL_MS, MIN_INTERVAL_MS, parseCustomSites } from '../shared/settings.js'
import type { Translate } from './locale.js'

export interface SettingsViewProps {
  t: Translate
  settings: ChatDockSettings
  enabledSites: WebChatSite[]
  onChange(next: ChatDockSettings): void
  onReset(): void
  onClose(): void
}

export function SettingsView(props: SettingsViewProps): React.ReactElement {
  const { t, settings, enabledSites, onChange, onReset, onClose } = props
  const [customText, setCustomText] = React.useState(() => JSON.stringify(settings.customSites, null, 2))
  const [customError, setCustomError] = React.useState<string | undefined>(undefined)
  const [intervalText, setIntervalText] = React.useState(() => String(settings.intervalMs))
  const customJson = JSON.stringify(settings.customSites)

  React.useEffect(() => {
    setCustomText(JSON.stringify(settings.customSites, null, 2))
  }, [customJson])

  React.useEffect(() => {
    setIntervalText(String(settings.intervalMs))
  }, [settings.intervalMs])

  const enabled = (site: WebChatSite): boolean => settings.overrides[site.id]?.enabled ?? site.enabledByDefault

  const toggleSite = (site: WebChatSite, nextEnabled: boolean): void => {
    onChange({
      ...settings,
      overrides: {
        ...settings.overrides,
        [site.id]: { ...settings.overrides[site.id], enabled: nextEnabled },
      },
    })
  }

  const defaultSite = enabledSites.some((site) => site.id === settings.defaultSite)
    ? settings.defaultSite
    : enabledSites[0]?.id ?? ''

  const commitInterval = (): void => {
    const parsed = Number(intervalText)
    if (!Number.isFinite(parsed)) {
      setIntervalText(String(settings.intervalMs))
      return
    }
    const clamped = Math.min(Math.max(Math.round(parsed), MIN_INTERVAL_MS), MAX_INTERVAL_MS)
    setIntervalText(String(clamped))
    if (clamped !== settings.intervalMs) onChange({ ...settings, intervalMs: clamped })
  }

  const applyCustomSites = (): void => {
    const parsed = parseCustomSites(customText)
    if (parsed.error !== undefined) {
      setCustomError(parsed.error)
      return
    }
    setCustomError(undefined)
    onChange({ ...settings, customSites: parsed.sites })
  }

  return (
    <div className="dsh-chat-dock-settings">
      <div className="dsh-chat-dock-settings-actions" style={{ paddingTop: 0, borderTop: 'none' }}>
        <strong style={{ fontSize: 12 }}>{t('settings.title')}</strong>
        <button className="dsh-chat-dock-btn" onClick={onClose}>
          {t('settings.close')}
        </button>
      </div>

      <div className="dsh-chat-dock-field">
        <label htmlFor="dsh-chat-dock-default-site">{t('settings.defaultSite')}</label>
        <select
          id="dsh-chat-dock-default-site"
          className="dsh-chat-dock-select"
          value={defaultSite}
          disabled={enabledSites.length === 0}
          onChange={(event) => onChange({ ...settings, defaultSite: event.target.value })}
        >
          {enabledSites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.label.en}
            </option>
          ))}
        </select>
        {enabledSites.length === 0 ? <span className="dsh-chat-dock-hint">{t('settings.needSite')}</span> : null}
      </div>

      <div className="dsh-chat-dock-field">
        <label htmlFor="dsh-chat-dock-open-mode">{t('settings.openMode')}</label>
        <select
          id="dsh-chat-dock-open-mode"
          className="dsh-chat-dock-select"
          value={settings.openMode}
          onChange={(event) =>
            onChange({ ...settings, openMode: event.target.value === 'float' ? 'float' : 'docked' })
          }
        >
          <option value="docked">{t('settings.modeDocked')}</option>
          <option value="float">{t('settings.modeFloat')}</option>
        </select>
      </div>

      <label className="dsh-chat-dock-check">
        <input
          type="checkbox"
          checked={settings.mirror}
          onChange={(event) => onChange({ ...settings, mirror: event.target.checked })}
        />
        {t('settings.mirror')}
      </label>

      <div className="dsh-chat-dock-field">
        <label htmlFor="dsh-chat-dock-interval">
          {t('settings.interval')} <span className="dsh-chat-dock-tag">{t('settings.intervalHint')}</span>
        </label>
        <input
          id="dsh-chat-dock-interval"
          className="dsh-chat-dock-input"
          inputMode="numeric"
          value={intervalText}
          onChange={(event) => setIntervalText(event.target.value)}
          onBlur={commitInterval}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commitInterval()
            }
          }}
        />
      </div>

      <div className="dsh-chat-dock-field">
        <span className="dsh-chat-dock-field-label">{t('settings.sites')}</span>
        <div className="dsh-chat-dock-sites">
          {DEFAULT_SITES.map((site) => (
            <label className="dsh-chat-dock-site-row" key={site.id}>
              <input
                type="checkbox"
                checked={enabled(site)}
                onChange={(event) => toggleSite(site, event.target.checked)}
              />
              {site.label.en}
              {site.experimental === true ? <span className="dsh-chat-dock-tag">{t('settings.experimental')}</span> : null}
            </label>
          ))}
        </div>
      </div>

      <div className="dsh-chat-dock-field">
        <label htmlFor="dsh-chat-dock-custom-sites">{t('settings.custom')}</label>
        <textarea
          id="dsh-chat-dock-custom-sites"
          className="dsh-chat-dock-textarea"
          value={customText}
          spellCheck={false}
          placeholder={'[{"id":"my-chat","label":"My Chat","url":"https://example.com/chat"}]'}
          onChange={(event) => setCustomText(event.target.value)}
        />
        <span className="dsh-chat-dock-hint">{t('settings.customHint')}</span>
        {customError !== undefined ? (
          <span className="dsh-chat-dock-status" data-kind="error">
            {t('settings.invalid', { error: customError })}
          </span>
        ) : null}
        <div className="dsh-chat-dock-actions" style={{ alignSelf: 'flex-end', flex: 'none' }}>
          <button className="dsh-chat-dock-btn" onClick={applyCustomSites}>
            {t('settings.apply')}
          </button>
        </div>
      </div>

      <div className="dsh-chat-dock-settings-note">{t('settings.loginNote')}</div>

      <div className="dsh-chat-dock-settings-actions">
        <button className="dsh-chat-dock-btn" onClick={onReset}>
          {t('settings.reset')}
        </button>
        <button className="dsh-chat-dock-btn" onClick={onClose}>
          {t('settings.close')}
        </button>
      </div>
      <div className="dsh-chat-dock-about">{t('settings.about')}</div>
    </div>
  )
}
