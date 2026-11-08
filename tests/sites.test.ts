import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_SITES,
  extractDeepSeekLatest,
  hostMatches,
  localized,
  matchSite,
  normalizeHost,
  pageScript,
  pickSite,
  resolveSites,
} from '../src/shared/sites.js'
import { defaultSettings } from '../src/shared/settings.js'

interface FakeNode {
  innerText: string
  textContent: string
  getBoundingClientRect(): DOMRect
  contains(other: unknown): boolean
  checkVisibility(): boolean
}

function fakeNode(text: string, width = 100, height = 20): FakeNode {
  return {
    innerText: text,
    textContent: text,
    getBoundingClientRect: () => ({ width, height, x: 0, y: 0, top: 0, left: 0, right: width, bottom: height }) as DOMRect,
    contains: () => false,
    checkVisibility: () => true,
  }
}

function installDom(nodes: FakeNode[], selection = ''): () => void {
  const globals = globalThis as unknown as Record<string, unknown>
  const previousDocument = globals.document
  const previousWindow = globals.window
  globals.document = {
    querySelectorAll: (selector: string) => (selector === '.ds-markdown' ? nodes : []),
    body: fakeNode(''),
  }
  globals.window = {
    getSelection: () => (selection === '' ? null : { toString: () => selection }),
  }
  return () => {
    globals.document = previousDocument
    globals.window = previousWindow
  }
}

test('deepseek extractor picks the last visible markdown block', () => {
  const restore = installDom([fakeNode('old answer'), fakeNode('final answer')])
  try {
    assert.equal(extractDeepSeekLatest().trim(), 'final answer')
  } finally {
    restore()
  }
})

test('deepseek extractor skips invisible blocks and falls back to the selection', () => {
  const hidden = fakeNode('hidden answer', 0, 0)
  const restore = installDom([hidden], 'selected text')
  try {
    assert.equal(extractDeepSeekLatest().trim(), 'selected text')
  } finally {
    restore()
  }
})

test('pageScript serializes a self-contained page function', () => {
  const script = pageScript(extractDeepSeekLatest)
  assert.ok(script.startsWith('('))
  assert.ok(script.includes('querySelectorAll'))
  assert.ok(script.includes('getSelection'))
  assert.ok(!script.includes('import '))
})

test('host matching respects subdomains and protocol prefixes', () => {
  assert.equal(hostMatches('https://chat.deepseek.com/a/chat/1', ['chat.deepseek.com']), true)
  assert.equal(hostMatches('https://sub.chat.deepseek.com/', ['chat.deepseek.com']), true)
  assert.equal(hostMatches('https://evilchat.deepseek.com/', ['chat.deepseek.com']), false)
  assert.equal(hostMatches('not a url', ['chat.deepseek.com']), false)
  assert.equal(normalizeHost('HTTPS://Example.com:443/path'), 'example.com')
})

test('resolveSites returns DeepSeek by default and honours overrides', () => {
  assert.deepEqual(resolveSites(defaultSettings()).map((site) => site.id), ['deepseek'])

  const withChatGPT = resolveSites({
    ...defaultSettings(),
    overrides: { chatgpt: { enabled: true } },
  })
  assert.deepEqual(withChatGPT.map((site) => site.id), ['deepseek', 'chatgpt'])
  assert.equal(withChatGPT[1]?.experimental, true)

  const disabled = resolveSites({
    ...defaultSettings(),
    overrides: { deepseek: { enabled: false } },
  })
  assert.deepEqual(disabled, [])
})

test('resolveSites appends validated custom sites exactly once', () => {
  const settings = {
    ...defaultSettings(),
    customSites: [
      { id: 'my', label: 'My Chat', url: 'https://chat.example.com/', hosts: ['chat.example.com'] },
      { id: 'my', label: 'Duplicate', url: 'https://dupe.example.com/' },
      { id: 'deepseek', label: 'Collision', url: 'https://collide.example.com/' },
    ],
  }
  const sites = resolveSites(settings)
  assert.deepEqual(sites.map((site) => site.id), ['deepseek', 'custom:my'])
  assert.equal(sites[1]?.extraction.latestReply.includes('innerText'), true)
})

test('resolveSites skips custom sites the user disabled', () => {
  const sites = resolveSites({
    ...defaultSettings(),
    customSites: [{ id: 'off', label: 'Off', url: 'https://off.example.com/', enabled: false }],
  })
  assert.deepEqual(sites.map((site) => site.id), ['deepseek'])
})

test('matchSite, pickSite and localized use the expected site', () => {
  const sites = resolveSites({ ...defaultSettings(), overrides: { chatgpt: { enabled: true } } })
  assert.equal(matchSite(sites, 'https://chatgpt.com/c/1')?.id, 'chatgpt')
  assert.equal(pickSite(sites, 'missing')?.id, 'deepseek')
  assert.equal(pickSite(sites, 'chatgpt')?.id, 'chatgpt')
  assert.equal(localized({ en: 'A', zh: 'B' }, 'zh-CN'), 'B')
  assert.equal(localized({ en: 'A', zh: 'B' }, 'en-US'), 'A')
  assert.equal(DEFAULT_SITES.length, 3)
})
