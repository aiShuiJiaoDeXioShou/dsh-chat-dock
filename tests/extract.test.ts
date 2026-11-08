import assert from 'node:assert/strict'
import test from 'node:test'

import { lineCount, normalizeCapture, previewText } from '../src/shared/extract.js'

test('normalizeCapture trims, normalizes newlines and strips zero-width characters', () => {
  const raw = '  hello\u200b\r\nworld\r\n\r\n\r\n\r\nend  '
  assert.equal(normalizeCapture(raw), 'hello\nworld\n\n\nend')
})

test('normalizeCapture reads a text object and rejects everything else', () => {
  assert.equal(normalizeCapture({ text: 'from object' }), 'from object')
  assert.equal(normalizeCapture(undefined), '')
  assert.equal(normalizeCapture(null), '')
  assert.equal(normalizeCapture(42), '')
  assert.equal(normalizeCapture({ text: 42 }), '')
})

test('normalizeCapture bounds very large captures', () => {
  const result = normalizeCapture('x'.repeat(250_000))
  assert.equal(result.length, 200_000)
})

test('previewText truncates with an ellipsis and lineCount ignores blank lines', () => {
  assert.equal(previewText('short'), 'short')
  assert.equal(previewText('abcdefghij', 5), 'abcde…')
  assert.equal(lineCount('a\n\nb\n  \nc'), 3)
})
