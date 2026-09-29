import { describe, expect, it } from 'vitest'
import { childPath, isNoRepoCwd } from '../src/client/path.ts'

describe('no-repo paths', () => {
  it('recognizes the private directory on either separator', () => {
    expect(isNoRepoCwd(undefined)).toBe(false)
    expect(isNoRepoCwd('')).toBe(false)
    expect(isNoRepoCwd('/projects/app')).toBe(false)
    expect(isNoRepoCwd('C:\\Users\\u\\.arya\\.arya-no-repo\\session-1')).toBe(true)
    expect(isNoRepoCwd('/home/u/.arya/.arya-no-repo/session-1')).toBe(true)
    expect(isNoRepoCwd('/home/u/.arya-no-repo-notes')).toBe(false)
  })

  it('keeps the parent separator when a directory already exists', () => {
    expect(childPath('C:\\Users\\u\\.arya', '.arya-no-repo')).toBe('C:\\Users\\u\\.arya\\.arya-no-repo')
    expect(childPath('/home/u/.arya', '.arya-no-repo')).toBe('/home/u/.arya/.arya-no-repo')
  })
})
