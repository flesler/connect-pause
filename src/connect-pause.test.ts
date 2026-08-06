import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import pause, { pause as namedPause } from './connect-pause.js'

const distDir = join(dirname(fileURLToPath(import.meta.url)), '../dist')
const distCjs = join(distDir, 'connect-pause.cjs')
const distEsm = join(distDir, 'connect-pause.js')
const distEsmUrl = pathToFileURL(distEsm).href
const hasDist = existsSync(distCjs) && existsSync(distEsm)

describe('pause', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should export the same function as default and named', () => {
    expect(namedPause).toBe(pause)
    expect(pause.pause).toBe(pause)
  })

  it('should default delay to 1000ms', () => {
    const next = vi.fn()
    pause()({} as never, {} as never, next)
    vi.advanceTimersByTime(999)
    expect(next).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(next).toHaveBeenCalledWith(undefined)
  })

  it('should use a custom delay', () => {
    const next = vi.fn()
    pause(500)({} as never, {} as never, next)
    vi.advanceTimersByTime(500)
    expect(next).toHaveBeenCalledWith(undefined)
  })

  it('should treat 0 as the default delay', () => {
    const next = vi.fn()
    pause(0)({} as never, {} as never, next)
    vi.advanceTimersByTime(1000)
    expect(next).toHaveBeenCalledWith(undefined)
  })

  it('should pass an error to next after the delay', () => {
    const err = new Error('Send 500')
    const next = vi.fn()
    pause(100, err)({} as never, {} as never, next)
    vi.advanceTimersByTime(100)
    expect(next).toHaveBeenCalledWith(err)
  })

  describe('package import interop', () => {
    describe.skipIf(!hasDist)('CJS require', () => {
      it('should return a factory via require()', () => {
        const require = createRequire(import.meta.url)
        const pauseCjs = require(distCjs)
        expect(typeof pauseCjs).toBe('function')
        expect(pauseCjs).toBe(pauseCjs.pause)
        const next = vi.fn()
        pauseCjs(50)({} as never, {} as never, next)
        vi.advanceTimersByTime(50)
        expect(next).toHaveBeenCalledWith(undefined)
      })

      it('should return a factory via require().pause', () => {
        const require = createRequire(import.meta.url)
        const mod = require(distCjs)
        const pauseCjs = mod.pause
        expect(pauseCjs).toBe(mod)
        const next = vi.fn()
        pauseCjs(25)({} as never, {} as never, next)
        vi.advanceTimersByTime(25)
        expect(next).toHaveBeenCalledWith(undefined)
      })
    })

    describe.skipIf(!hasDist)('ESM import', () => {
      it('should return a factory via default import from dist', async () => {
        const mod = await import(distEsmUrl)
        const pauseEsm = mod.default
        expect(typeof pauseEsm).toBe('function')
        expect(pauseEsm).toBe(pauseEsm.pause)
        const next = vi.fn()
        pauseEsm(30)({} as never, {} as never, next)
        vi.advanceTimersByTime(30)
        expect(next).toHaveBeenCalledWith(undefined)
      })

      it('should return a factory via named import from dist', async () => {
        const mod = await import(distEsmUrl)
        const pauseEsm = mod.pause
        expect(typeof pauseEsm).toBe('function')
        expect(pauseEsm).toBe(mod.default)
        expect(pauseEsm).toBe(pauseEsm.pause)
        const next = vi.fn()
        pauseEsm(20)({} as never, {} as never, next)
        vi.advanceTimersByTime(20)
        expect(next).toHaveBeenCalledWith(undefined)
      })
    })
  })
})
