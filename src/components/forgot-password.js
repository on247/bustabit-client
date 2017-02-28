import React, { Component } from 'react'
import { Form, FormGroup, Col, InputGroup } from 'react-bootstrap'
import { validateEmail } from '../util/belt'
import socket from '../socket'
import { browserHistory } from 'react-router'
import notification from '../core/notification'
import ReCAPTCHA from 'react-grecaptcha';


class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		this.firstInput = null; // this is a ref
		this.state = {
			email: '',
			emailError: '',
			error: null,
      recaptcha: false
		};
	}
	componentDidMount(){
		this.firstInput.focus();
	}

// this returns true if the form is valid
	validate(values) {
		const emailError = validateEmail(values.email);
		this.setState({
			emailError
		});
		return !emailError;
	}

	onEmailChange(event) {
		const email = event.target.value;
		const emailError = validateEmail(email);
		this.setState({email, emailError});
	}

	_handleLogin(e) {
		e.preventDefault();
		if (this.validate(this.state)) {
			let {email} = this.state;
			return socket
				.send('forgotPassword', {email})
				.then(info => {
					browserHistory.push('/');
					notification.setMessage('You\'ll receive an email with the instructions to reset your password.');
				}, err => {

					if (err === 'INVALID_EMAIL') {
						this.setState({
							emailError: 'This email doesn\'t exist.'
						})
						notification.setMessage('This email doesn\'t exist.');
					}
					else {
						console.error(err);
						notification.setMessage('Unexpected server error: ' + err, 'error');
					}
				})
		}
	}

	render() {
		const { emailError, recaptcha }  = this.state;
		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
				<Form horizontal onSubmit={(e) => this._handleLogin(e)}>
					<Col xs={16} xsOffset={4}>
						{ emailError && <strong className="red-error">{emailError}</strong>}
						<FormGroup className={emailError ? 'has-error' : ''}>
							<InputGroup>
								<InputGroup.Addon>
									Email:
								</InputGroup.Addon>
								<input type="text"
											 placeholder="Email"
											 className="form-control"
											 value={this.state.email}
											 ref={(input) => { this.firstInput = input; }}
											 onChange={(event) => this.onEmailChange(event)}
								/>
							</InputGroup>
						</FormGroup>
					</Col>
					<Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px', marginBottom: '15px'}}>
						<ReCAPTCHA
							ref="recaptcha"
							sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
							callback={ () => this.setState({ recaptcha: true }) }
							expiredCallback={ () => console.error('recaptcha expired..') }
						/>
					</Col>

					<Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<button className='btn btn-success btn-lg' type="submit" disabled={ recaptcha ? false : true }>Submit</button>
					</Col>
				</Form>
			</div>
		);
	}
}

export default ForgotPassword;