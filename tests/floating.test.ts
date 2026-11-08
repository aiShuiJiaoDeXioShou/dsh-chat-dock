import assert from 'node:assert/strict'
import test, { after } from 'node:test'

import { DEFAULT_SITES } from '../src/shared/sites.js'
import { floatActive, openSideUi, openSite, type SidebarRightFace } from '../src/client/floating.js'

const site = DEFAULT_SITES[0]!
const globals = globalThis as unknown as Record<string, unknown>
const previousDocument = globals.document

globals.document = {
  querySelectorAll: (selector: string) =>
    selector === 'webview[data-sidebar-browser-frame]'
      ? [
          {
            isConnected: true,
            getURL: () => 'https://chat.deepseek.com/a/chat/1',
            getTitle: () => 'Chat',
            getBoundingClientRect: () => ({ width: 100, height: 100 }) as DOMRect,
          },
        ]
      : [],
}

after(() => {
  globals.document = previousDocument
})

class FakeNav implements SidebarRightFace {
  calls: Array<{ kind: string; options?: Record<string, unknown> }> = []
  floats: string[] = []
  activeId: string | undefined = 'tab-1'

  openTab(kind: string, options?: Record<string, unknown>): unknown {
    this.calls.push({ kind, options })
    return undefined
  }

  active(): { id?: unknown } | undefined {
    return this.activeId === undefined ? undefined : { id: this.activeId }
  }

  float(tabId: string): unknown {
    this.floats.push(tabId)
    return undefined
  }
}

test('openSite opens a browser tab with the site url', () => {
  const nav = new FakeNav()
  const outcome = openSite(nav, site, 'docked')
  assert.deepEqual(outcome, { ok: true, floated: false })
  assert.equal(nav.calls.length, 1)
  assert.equal(nav.calls[0]?.kind, 'browser')
  assert.deepEqual(nav.calls[0]?.options, { params: { url: site.url } })
  assert.deepEqual(nav.floats, [])
})

test('openSite floats the new tab when a visible Chat view is active', () => {
  const nav = new FakeNav()
  const outcome = openSite(nav, site, 'float')
  assert.equal(outcome.ok, true)
  assert.equal(outcome.floated, true)
  assert.deepEqual(nav.floats, ['tab-1'])
})

test('openSite reports an unavailable sidebar and a throwing openTab', () => {
  assert.deepEqual(openSite(undefined, site, 'docked'), {
    ok: false,
    floated: false,
    reason: 'unavailable',
  })

  const throwing: SidebarRightFace = {
    openTab: () => {
      throw new Error('no session')
    },
  }
  const outcome = openSite(throwing, site, 'docked')
  assert.equal(outcome.ok, false)
  assert.equal(outcome.reason, 'error')
  assert.equal(outcome.error, 'no session')
})

test('floatActive floats the active tab and tolerates an unavailable sidebar', () => {
  const nav = new FakeNav()
  assert.equal(floatActive(nav), true)
  assert.deepEqual(nav.floats, ['tab-1'])
  assert.equal(floatActive(undefined), false)
  assert.equal(floatActive(new FakeNav()), true)
  const noActive = new FakeNav()
  noActive.activeId = undefined
  assert.equal(floatActive(noActive), false)
})

test('openSideUi opens a built-in sidebar page by kind', () => {
  const nav = new FakeNav()
  assert.equal(openSideUi(nav, 'files'), true)
  assert.equal(nav.calls[0]?.kind, 'files')
  assert.equal(openSideUi(nav, ''), false)
  assert.equal(openSideUi(undefined, 'files'), false)
})
