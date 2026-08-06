// Mirrored from createServer namespace in @types/connect (NextHandleFunction).
// Compared against:
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/451dc8fc19383bc12af59522020e571957f1684e/types/connect/index.d.ts

import type * as http from 'node:http'

export interface IncomingMessage extends http.IncomingMessage {
  originalUrl?: http.IncomingMessage['url'] | undefined
}

export type NextFunction = (err?: any) => void

export type NextHandleFunction = (
  req: IncomingMessage,
  res: http.ServerResponse,
  next: NextFunction,
) => void
