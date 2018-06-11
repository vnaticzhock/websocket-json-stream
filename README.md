# WebSocketJSONStream

[![npm version](https://badge.fury.io/js/%40teamwork%2Fwebsocket-json-stream.svg)](https://badge.fury.io/js/%40teamwork%2Fwebsocket-json-stream)
[![Build Status](https://travis-ci.org/Teamwork/websocket-json-stream.svg?branch=master)](https://travis-ci.org/Teamwork/websocket-json-stream)
[![Coverage Status](https://coveralls.io/repos/github/Teamwork/websocket-json-stream/badge.svg)](https://coveralls.io/github/Teamwork/websocket-json-stream)

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
