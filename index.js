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
            let value

            try {
                value = JSON.parse(message)
            } catch (error) {
                return this.emit('error', error)
            }

            if (value == null) {
                return this.emit('error', new Error('Can\'t JSON.parse the value'))
            }

            this.push(value)
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
        let json

        try {
            json = JSON.stringify(object)
        } catch (error) {
            return callback(error)
        }

        if (typeof json !== 'string') {
            return callback(new Error('Can\'t JSON.stringify the value'))
        }

        this.ws.send(json, callback)
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
