/**
 * connect-pause
 * Copyright(c) 2013 Ariel Flesler <aflesler@gmail.com>
 * MIT Licensed
 */

import type { NextHandleFunction } from './types.js'

function pause(delay?: number, err?: unknown): NextHandleFunction {
  const ms = delay || 1000

  return function (_req, _res, next) {
    setTimeout(next, ms, err)
  }
}

pause.pause = pause

export { pause }
export default pause
