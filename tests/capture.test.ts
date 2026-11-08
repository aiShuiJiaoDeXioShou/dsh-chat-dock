import assert from 'node:assert/strict'
import test from 'node:test'

import { DEFAULT_SITES } from '../src/shared/sites.js'
import {
  captureLatest,
  isViewVisible,
  listBrowserViews,
  pickView,
  viewTitle,
  viewUrl,
  viewsForSite,
  type BrowserViewLike,
} from '../src/client/capture.js'

const site = DEFAULT_SITES[0]!

interface FakeViewOptions {
  visible?: boolean
  result?: unknown
  reject?: Error
  connected?: boolean
}

function fakeView(url: string, options: FakeViewOptions = {}): BrowserViewLike {
  const visible = options.visible ?? true
  return {
    isConnected: options.connected ?? true,
    getURL: () => url,
    getTitle: () => 'Chat',
    getBoundingClientRect: () =>
      ({
        width: visible ? 100 : 0,
        height: visible ? 100 : 0,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: visible ? 100 : 0,
        bottom: visible ? 100 : 0,
      }) as DOMRect,
    executeJavaScript: async () => {
      if (options.reject !== undefined) throw options.reject
      return options.result
    },
  }
}

function fakeRoot(views: unknown[]): Document {
  return { querySelectorAll: () => views } as unknown as Document
}

test('listBrowserViews and viewsForSite filter by site host', () => {
  const deepseek = fakeView('https://chat.deepseek.com/a/chat/1')
  const other = fakeView('https://example.com/')
  const root = fakeRoot([deepseek, other])
  assert.equal(listBrowserViews(root).length, 2)
  assert.deepEqual(viewsForSite(site, root), [deepseek])
  assert.equal(pickView(site, root), deepseek)
})

test('pickView prefers a visible view over a background one', () => {
  const background = fakeView('https://chat.deepseek.com/a', { visible: false })
  const foreground = fakeView('https://chat.deepseek.com/b')
  assert.equal(pickView(site, fakeRoot([background, foreground])), foreground)
  assert.equal(pickView(site, fakeRoot([background])), background)
  assert.equal(isViewVisible(background), false)
})

test('captureLatest normalizes a successful result', async () => {
  const view = fakeView('https://chat.deepseek.com/a', { result: '  hello  ' })
  const result = await captureLatest(site, { root: fakeRoot([view]) })
  assert.equal(result.ok, true)
  if (result.ok) {
    assert.equal(result.text, 'hello')
    assert.equal(result.url, 'https://chat.deepseek.com/a')
    assert.equal(result.title, 'Chat')
  }
})

test('captureLatest reports no-page, empty, error and timeout', async () => {
  const noPage = await captureLatest(site, { root: fakeRoot([]) })
  assert.equal(noPage.ok, false)
  if (!noPage.ok) assert.equal(noPage.reason, 'no-page')

  const empty = await captureLatest(site, { root: fakeRoot([fakeView('https://chat.deepseek.com/a', { result: '   ' })]) })
  assert.equal(empty.ok, false)
  if (!empty.ok) assert.equal(empty.reason, 'empty')

  const failed = await captureLatest(site, {
    root: fakeRoot([fakeView('https://chat.deepseek.com/a', { reject: new Error('boom') })]),
  })
  assert.equal(failed.ok, false)
  if (!failed.ok) {
    assert.equal(failed.reason, 'error')
    assert.equal(failed.error, 'boom')
  }

  const stalled: BrowserViewLike = {
    isConnected: true,
    getURL: () => 'https://chat.deepseek.com/a',
    getBoundingClientRect: () => ({ width: 10, height: 10 }) as DOMRect,
    executeJavaScript: () => new Promise(() => {}),
  }
  const timedOut = await captureLatest(site, { root: fakeRoot([stalled]), timeoutMs: 10 })
  assert.equal(timedOut.ok, false)
  if (!timedOut.ok) assert.equal(timedOut.reason, 'timeout')
})

test('view helpers tolerate a destroyed guest', () => {
  const view: BrowserViewLike = {
    isConnected: false,
    getURL: () => {
      throw new Error('destroyed')
    },
    getTitle: () => {
      throw new Error('destroyed')
    },
    getBoundingClientRect: () => {
      throw new Error('destroyed')
    },
  }
  assert.equal(viewUrl(view), '')
  assert.equal(viewTitle(view), '')
  assert.equal(isViewVisible(view), false)
})
