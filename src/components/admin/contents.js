import React, { Component } from 'react';

import socket from '../../socket'
import { formatBalance } from '../../util/belt'
import notification from '../../core/notification'

export default class Contents extends Component {

	getHotWalletBalance() {
		socket.send('getHotWalletBalance')
			.then(x => notification.setMessage("Hot Wallet Balance: " + formatBalance(x) + ' bits'))
			.catch(x => {
				console.error('getHotWalletBalance error:', x);
				notification.setMessage("error with hot wallet: " + x, 'error');
			})
	}

	sendStop() {
		socket.send('stop')
			.then(x => notification.setMessage('stop sent successfully!'))
			.catch(err => {
				console.error('Could not stop: ', err);
				notification.setMessage(err, 'error');
			})
	}

	sendResume() {
		socket.send('resume')
			.then(x => notification.setMessage('resume sent successfully!'))
			.catch(err => {
				console.error('Could not resume: ', err);
				notification.setMessage(err, 'error');
			})
	}

	render () {
		return <div>
			<button className="btn btn-primary"
				onClick={ () => this.getHotWalletBalance() }
			>Get Hot Wallet Balance!</button>
			<br/>
			<button className="btn btn-danger"
				onClick={ () => this.sendStop() }
			>Stop Games!</button>
			<br/>
			<button className="btn btn-warning"
							onClick={ () => this.sendResume() }
			>Resume Games!</button>
		</div>
	}
}
