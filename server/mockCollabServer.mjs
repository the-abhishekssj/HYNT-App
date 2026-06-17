import http from 'node:http'
import { mockInitialState } from '../src/features/collaboration/mockProjectStore.js'

const PORT = Number(process.env.HYNT_MOCK_API_PORT || 8787)
let state = mockInitialState

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  })
  response.end(JSON.stringify(payload))
}

const readBody = (request) => new Promise((resolve, reject) => {
  let body = ''
  request.on('data', (chunk) => {
    body += chunk
  })
  request.on('end', () => resolve(body))
  request.on('error', reject)
})

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 200, { ok: true })
    return
  }

  if (request.url === '/state' && request.method === 'GET') {
    sendJson(response, 200, state)
    return
  }

  if (request.url === '/state' && (request.method === 'PUT' || request.method === 'POST')) {
    try {
      const body = await readBody(request)
      state = JSON.parse(body)
      sendJson(response, 200, { ok: true })
    } catch {
      sendJson(response, 400, { ok: false })
    }
    return
  }

  sendJson(response, 404, { ok: false })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`HYNT mock collaboration API listening on http://0.0.0.0:${PORT}`)
})
