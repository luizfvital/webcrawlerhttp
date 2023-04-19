const { normalizeURL } = require('./crawl')
const { test, expect } = require('@jest/globals')

test('normalizeURL strip https protocol', () => {

  const input = 'https://blog.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'

  expect(actual).toEqual(expected)
})

test('normalizeURL strip http protocol', () => {

  const input = 'http://blog.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'

  expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
  
  const input = 'https://blog.boot.dev/path/'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'

  expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
  
  const input = 'https://Blog.boot.dev/Path/'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'

  expect(actual).toEqual(expected)
})