/**
 * dsh-theme-p5r — Host half.
 *
 * The theme is a Client-side skin, but it needs one thing the browser cannot do
 * for itself: hand the page a media file that lives on this machine.
 * `/plugins/<id>/...` only serves declared client chunks, so an asset dropped
 * next to client.js is unreachable from the page — that is why the earlier
 * tail.png drop-in silently did nothing. This half owns a named route instead:
 *
 *   /theme-p5r/media/<name>
 *
 * Only the names in ALLOWED are served, always from this package's own
 * directory, so the route cannot be used to read anything else on disk. Those
 * files are the user's own and stay git-ignored: missing means 404, and the
 * client falls back to its drawn effect.
 */
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGE_DIR = fileURLToPath(new URL('.', import.meta.url))
const ROUTE_PREFIX = '/theme-p5r/media'

/** User-supplied artwork and audio only; nothing else is served. */
const ALLOWED = new Map([
  ['up.webp', 'image/webp'],
  ['up.gif', 'image/gif'],
  ['up.png', 'image/png'],
  ['up.mp4', 'video/mp4'],
  ['up.m4a', 'audio/mp4'],
  ['up.aac', 'audio/aac'],
  ['up.mp3', 'audio/mpeg'],
  ['up.ogg', 'audio/ogg'],
  ['up.webm', 'audio/webm'],
])

const NAME = 'dsh-theme-p5r'

/**
 * Answer one media request. Anything outside ALLOWED, or any name trying to
 * escape the package directory, is a 404 — the route is deliberately dumb.
 */
async function serve(request, response) {
  const url = new URL(request.url ?? '/', 'http://localhost')
  const name = decodeURIComponent(url.pathname.slice(ROUTE_PREFIX.length + 1))
  const type = ALLOWED.get(name)

  if (type === undefined || name.includes('/') || name.includes('\\')) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('not found')
    return
  }

  const file = join(PACKAGE_DIR, name)
  let size
  try {
    const info = await stat(file)
    if (!info.isFile()) throw new Error('not a file')
    size = info.size
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('missing')
    return
  }

  const headers = {
    'content-type': type,
    'accept-ranges': 'bytes',
    'cache-control': 'no-cache',
  }

  /* Chromium asks for ranges even for a short clip, so the single-range case is
     honoured instead of always sending the whole file. */
  const range = request.headers.range
  if (typeof range === 'string') {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim())
    if (match !== null) {
      const start = match[1] === '' ? 0 : Number(match[1])
      const end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1)
      if (Number.isFinite(start) && start >= 0 && start <= end) {
        response.writeHead(206, {
          ...headers,
          'content-range': `bytes ${start}-${end}/${size}`,
          'content-length': String(end - start + 1),
        })
        createReadStream(file, { start, end }).pipe(response)
        return
      }
    }
  }

  response.writeHead(200, { ...headers, 'content-length': String(size) })
  createReadStream(file).pipe(response)
}

export const inject = ['webServer']

export function apply(ctx) {
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE_PREFIX,
      handler: (request, response) => {
        void serve(request, response).catch(() => {
          if (!response.headersSent) response.writeHead(500)
          response.end()
        })
      },
    }),
  )
  ctx.logger?.info?.(`${NAME}: optional media served from ${ROUTE_PREFIX}`)
}