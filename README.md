# connect-pause

Connect/Express middleware to simulate latency while debugging.

Works in Node.js (14+). ESM, CommonJS, and TypeScript types included.

[![NPM](https://nodei.co/npm/connect-pause.png?compact=true)](https://npmjs.org/package/connect-pause)

```bash
npm install connect-pause
```

```js
import pause from 'connect-pause'
// or
const pause = require('connect-pause')
```

---

## Usage

Pause all Connect requests:

```js
const connect = require('connect')
const pause = require('connect-pause')

connect.createServer(
  pause(1000),
  function (req, res, next) {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Waited 1 second')
  },
).listen(8080)
```

Pause all Express requests:

```js
const express = require('express')
const pause = require('connect-pause')

const app = express()
app.use(pause(1000))
app.get('/', function (req, res) {
  res.send('Waited 1 second')
})
app.listen(3000)
```

Pause a single Express endpoint:

```js
const express = require('express')
const pause = require('connect-pause')

const app = express()
app.get('/', pause(1000), function (req, res) {
  res.send('Waited 1 second')
})
app.listen(3000)
```

Pass an error to be returned after the delay:

```js
const express = require('express')
const pause = require('connect-pause')

const app = express()
app.get('/', pause(1000, new Error('Send 500')), function (req, res) {
  res.send('Waited 1 second')
})
app.listen(3000)
```

---

## API

`pause(delay?, err?)` returns a middleware function.

- `delay` — milliseconds before calling `next` (default `1000`). Falsy values use the default.
- `err` — optional error passed to `next(err)` after the delay.

---

## TypeScript

Types ship with the package (since 1.0.0).

```ts
import pause from 'connect-pause'
import type { RequestHandler } from 'express'

const middleware: RequestHandler = pause(500)
```

---

## Development

```bash
npm install
npm run lint
npm run build
npm test
```

---

## License

MIT — see [LICENSE](LICENSE).
