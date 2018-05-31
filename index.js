const Duplex = require('stream').Duplex
const WebSocket = require('ws')

module.exports = class WebSocketJSONStream extends Duplex {
    constructor(ws) {
        super({
            objectMode: true,
            allowHalfOpen: false
        })

        this.ws = ws;

        this.ws.on('message', message => {
            try {
                this.push(JSON.parse(message))
            } catch (error) {
                this.emit('error', error)
            }
        })

        this.ws.on('close', () => {
            this.push(null)
            this.emit('close')
        })

        this.ws.on('error', error => {
            this.emit('error', error)
        })
    }

    _read() {}

    _write(object, encoding, callback) {
        try {
            const json = JSON.stringify(object)

            if (typeof json === 'string') {
                this.ws.send(json, callback)
            } else {
                callback(new Error('Can\'t convert the value to JSON'))
            }
        } catch (error) {
            callback(error)
        }
    }

    _final(callback) {
        this._closeWebSocket(callback)
    }

    _destroy(error, callback) {
        this._closeWebSocket(() => callback(error))
    }

    _closeWebSocket(callback) {
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                this.ws.once('error', () => this._closeWebSocket(callback))
                this.ws.once('open', () => this._closeWebSocket(callback))
                break
            case WebSocket.OPEN:
                this.ws.once('close', () => process.nextTick(callback))
                this.ws.close()
                break
            case WebSocket.CLOSING:
                this.ws.once('close', () => callback())
                break
            case WebSocket.CLOSED:
                process.nextTick(callback)
                break
            default:
                process.nextTick(callback, new Error(`Unexpected readyState: ${this.ws.readyState}`))
                break
        }
    }
}
