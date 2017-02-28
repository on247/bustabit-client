// power-socket is a simple library that somewhat emulates socket.io but
// purely over websockets

import EventEmitter from 'events';
import { generateUuid } from '../util/belt'
import work from 'work-token/async';


// emits
//  connect
//  disconnect
//   <servername of message>
// STATUS_CHANGED


export default class PowerSocket extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;

    this.status = 'DISCONNECTED'; // DISCONNECTED | CONNECTING | CONNECTED

    this.buff = [];
    this.nextMessageId = 1;
    this.resolveRejectSpareArray = [];

    this.connectionAttempts = 1;
    this._createWebSocket();

  }

  getT() {
		let t = window.localStorage.getItem('t');
		if (!t) {
			t = generateUuid();
			window.localStorage.setItem('t', t);
		}

  	return t;
	}

	getSecret() {
  	return window.localStorage.getItem('secret') || '';
	}
  
  // Sends a message, returns a promise..
  send(what, payload) {

    return new Promise((resolve, reject) => {
      if (!what || typeof what !== 'string' || what.includes(':'))
        throw new Error('invalid what');

      if (payload === undefined)
        payload = null;

      this.buff.push([what, this.nextMessageId++, JSON.stringify(payload), [resolve, reject]]);

      this._processBuffer();
    });
  }

  _acceptChallenge(event) {
		const challenge = event.data;

		const difficulty = Number.parseInt(challenge[0],10) * 2;

		const start = Date.now();

		console.log('Solving challenge..');

		work.generate(challenge, difficulty, (err, token) => {
			if (err) throw err;

			console.log('Took: ', Date.now() - start, 'ms to solve');

			const response = token.substring(challenge.length);

			this.connection.send(response + ':' + this.getT() + ':' + this.getSecret());


			this.connection.onmessage = (event) => {

				const info = JSON.parse(event.data);
				this.emit('connect', info);
				this._setStatus('CONNECTED');

				this.connection.onmessage = (event) => this._onMessage(event);

				this.connectionAttempts = 0;
				this._processBuffer();
			};


		});

	}

	_setStatus(status) {
  	this.status = status;
  	this.emit('STATUS_CHANGED');
	}

  _createWebSocket () {
    try {
      this.connection = new WebSocket(this.url);
    } catch (ex) {
      console.error('Websocket creation error: ', ex);
      // Don't throw an error, as by this stage there's probably no error listeners set up..
      this.connection = {};
      return;
    }

    this._setStatus('CONNECTING');


		this.connection.onmessage = (event) => this._acceptChallenge(event);


    this.connection.onclose = (r) => {
			this._setStatus('DISCONNECTED');

      console.log('socket closed because of: ', r);


      var time = Math.min(30, (Math.pow(2, this.connectionAttempts) - 1)) * 1000;

      console.log('[socket] connection closed, retrying in ', time, 'ms');

      setTimeout(() => {
        // We've tried to reconnect so increment the attempts by 1
        this.connectionAttempts++;

        // Connection has closed so try to reconnect....
        this._createWebSocket();
      }, time);
    }
  }

  _processBuffer() {
    if (this.connection.readyState !== 1) {
      console.log('[Socket] connection not open, waiting..');
      return;
    }

    for (let buff of this.buff) {

      const [what, messageId, payload, resolveReject] = buff;

      if (resolveReject)
        this.resolveRejectSpareArray[messageId] = resolveReject;

      this.connection.send(
        what + ':' + messageId + ':' + payload
      )
    }
    this.buff = [];
  }

  _onMessage(event) {
    const data = event.data;

    if (data[0] === 'E' || data[0] === 'R') {
      this._onResponse(data);
      return;
    }


    const firstColon = event.data.indexOf(':');
    if (firstColon <= 0)
      throw new Error('missing first colon');


    const what = data.substring(1, firstColon);
    let payload = data.substring(firstColon+1);


    payload = JSON.parse(payload);


    this.emit(what, payload);
  }

  _onResponse(data) {

		const firstColon = data.indexOf(':');
    if (firstColon <= 0)
      throw new Error('missing first colon');

    let messageId = data.substring(1, firstColon);
    messageId = Number.parseInt(messageId,10);
    if (!Number.isInteger(messageId))
      throw new Error('invalid message id');


    let payload = data.substring(firstColon+1);
    payload = JSON.parse(payload);

    const resolveReject = this.resolveRejectSpareArray[messageId];
    if (!resolveReject) {
      throw new Error('No resolveReject for message ' + messageId);
    }
    delete this.resolveRejectSpareArray[messageId];

    // if it's an error
    if (data[0] === 'E') {
      resolveReject[1](payload.message);
    } else {
      resolveReject[0](payload);
    }

  }

}