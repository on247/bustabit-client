import React, { PureComponent } from 'react'
import ReCAPTCHA from 'react-grecaptcha';
import { Col, Row } from 'react-bootstrap'

import socket from '../socket'
import notification from '../core/notification'
import { browserHistory } from 'react-router'
import userInfo from '../core/userInfo'
import refresher from '../refresher';
import NotLoggedIn from './not-logged-in-well'


class Faucet extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			status: 'UNCLAIMED'
		};
	}

	onChange(val) {

		// Work around issue: https://github.com/evenchange4/react-grecaptcha/issues/41
		setTimeout(() => {
			this.setState({status: 'CLAIMING'});
		}, 10);

		socket.send('claimFaucet', val)
			.then(() => {
					console.log('faucet was claimed.');
					this.setState({
						status: 'CLAIMED'
					})
					browserHistory.push('/');
					notification.setMessage(<span><span className="green-tag">Success!</span> Faucet claimed.</span>);
				},
				err => {
					console.error('Got error claiming faucet: ', err);
					this.setState({status: 'ERROR', error: err.message || 'unknown error'})
					browserHistory.push('/');
					notification.setMessage(<span><span className="red-tag">Error </span> Error claiming faucet: {err}.</span>, 'error');
				}
			)
	}


	render() {

		let recaptcha = <ReCAPTCHA
			ref="recaptcha"
			sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
			callback={ this.onChange.bind(this) }
			expiredCallback={ () => console.error('recaptcha expired..') }
		/>;


		let faucetDisplay = (
			<Row>
				<Col xs={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<h4 style={{textAlign: 'center'}}>Claim faucet</h4>
					{ recaptcha }
				</Col>
			</Row>
		);

		if (!userInfo.uname) {
			return (
				<NotLoggedIn/>
			)
		}

		if (this.state.status === 'CLAIMING')
			return (
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<Col xs={20} style={{textAlign: 'center'}}>
						<i className="fa fa-spinner fa-pulse fa-3x fa-fw loading-animation-blue"></i>
					</Col>
				</div>
			);
		else if (this.state.status === 'ERROR')
			return (
				<div>
					<p><b>Oh noes!</b> There was an error claiming the faucet!</p>
					<p className="red-error">
						Got error: { this.state.error }
					</p>
				</div>
			);
		else
			return (
				<div>
					{ faucetDisplay }
				</div>
			);
	}
}

export default refresher(Faucet,
	[userInfo, 'UNAME_CHANGED']
);