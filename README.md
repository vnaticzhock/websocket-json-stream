# WebSocketJSONStream

A nodejs stream wrapper for WebSocket connections.

## Usage

```js
const WebSocket = require('ws')
const WebSocketJSONStream = require('@teamwork/websocket-json-stream')

const stream = new WebSocketJSONStream(new WebSocket(url))
// ...

new WebSocket.Server({ server }).on('connection', ws => {
    const stream = new WebSocketJSONStream(ws)
    // ...
})
```

See [example.js](./example.js) for a working usage example.
