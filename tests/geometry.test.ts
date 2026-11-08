import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CONSOLE_MARGIN,
  clampConsoleState,
  clampRect,
  defaultBounds,
  isConsoleRect,
  pillRect,
} from '../src/shared/geometry.js'

test('defaultBounds anchors the console at the bottom right', () => {
  const bounds = defaultBounds({ width: 1440, height: 900 })
  assert.deepEqual(bounds, { x: 1064, y: 364, width: 360, height: 520 })
})

test('clampRect keeps the console reachable', () => {
  assert.deepEqual(clampRect({ x: -100, y: -100, width: 360, height: 520 }, { width: 1440, height: 900 }), {
    x: CONSOLE_MARGIN,
    y: CONSOLE_MARGIN,
    width: 360,
    height: 520,
  })
  const far = clampRect({ x: 5000, y: 5000, width: 360, height: 520 }, { width: 1440, height: 900 })
  assert.equal(far.x, 1440 - 360 - CONSOLE_MARGIN)
  assert.equal(far.y, 900 - 520 - CONSOLE_MARGIN)
})

test('clampRect shrinks an oversized console and survives a tiny viewport', () => {
  const oversized = clampRect({ x: 0, y: 0, width: 5000, height: 4000 }, { width: 1440, height: 900 })
  assert.equal(oversized.width, 1440 - CONSOLE_MARGIN * 2)
  assert.equal(oversized.height, 900 - CONSOLE_MARGIN * 2)

  const tiny = clampRect({ x: 0, y: 0, width: 360, height: 520 }, { width: 320, height: 300 })
  assert.equal(tiny.width, 288)
  assert.equal(tiny.height, 268)
  assert.ok(tiny.x >= CONSOLE_MARGIN)
  assert.ok(tiny.y >= CONSOLE_MARGIN)
})

test('isConsoleRect rejects malformed values', () => {
  assert.equal(isConsoleRect({ x: 1, y: 2, width: 3, height: 4 }), true)
  assert.equal(isConsoleRect({ x: 1, y: 2, width: 0, height: 4 }), false)
  assert.equal(isConsoleRect({ x: '1', y: 2, width: 3, height: 4 }), false)
  assert.equal(isConsoleRect(null), false)
})

test('clampConsoleState and pillRect keep the collapsed state on screen', () => {
  const state = clampConsoleState(
    { bounds: { x: 5000, y: 5000, width: 360, height: 520 }, collapsed: true, hidden: false },
    { width: 1440, height: 900 },
  )
  assert.equal(state.collapsed, true)
  const pill = pillRect(state.bounds, { width: 1440, height: 900 })
  assert.equal(pill.width, 44)
  assert.equal(pill.height, 44)
  assert.ok(pill.x + pill.width <= 1440)
  assert.ok(pill.y + pill.height <= 900)
})
