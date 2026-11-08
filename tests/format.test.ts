import assert from 'node:assert/strict'
import test from 'node:test'

import { formatClock, insertionText, shortHost } from '../src/shared/format.js'

test('insertionText trims trailing spaces and guarantees one trailing newline', () => {
  assert.equal(insertionText('  a  \n'), '  a\n')
  assert.equal(insertionText('a  \n'), 'a\n')
  assert.equal(insertionText('a\n\nb'), 'a\n\nb\n')
  assert.equal(insertionText('   '), '')
})

test('formatClock and shortHost are display-safe', () => {
  assert.notEqual(formatClock(Date.now()), '')
  assert.equal(formatClock(Number.NaN), '')
  assert.equal(shortHost('https://chat.deepseek.com/a/chat/1'), 'chat.deepseek.com')
  assert.equal(shortHost('not a url'), 'not a url')
})
