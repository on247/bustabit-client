import React, { PureComponent } from 'react'
import { Form, FormGroup, Col, InputGroup } from 'react-bootstrap'
import { Link, browserHistory } from 'react-router'
import { validateEmail } from '../util/belt'
import socket from '../socket'
import notification from '../core/notification'
import ReCAPTCHA from 'react-grecaptcha';
import userInfo from '../core/userInfo'
import refresher from '../refresher';

function validateMessage(message) {
	if (!message)
		return 'Please write a message.';

}

class Support extends PureComponent {
	constructor(props) {
		super(props);
		this.firstInput = null; // this is a ref
		this.state = {
			email: null, // this is null or text
			message: '',
			error: null,
			emailError: null,
			messageError: null,
			recaptcha: null, // It is null if the recaptcha hasn't been sumbitted, otherwise it's a string.
			submitting: false,
			touched: false
		};
	}

	componentDidMount(){
		this.firstInput.focus();
	}

	onEmailChange(event) {
		const email = event.target.value;
		const emailError = this.state.touched ? validateEmail(email) : null;
		this.setState({email, emailError});
	}

	onMessageChange(event) {
		const message = event.target.value;
		const messageError = this.state.touched ? validateMessage(message) : null;
		this.setState({message, messageError});
	}

	validate() {

		let isValid = true;

		const emailError = validateEmail(this.getEmail());
		this.setState({emailError});
		isValid = isValid && !emailError;

		const messageError = validateMessage(this.state.message);
		this.setState({messageError});
		isValid = isValid && !messageError;

		return isValid;
	}

	onRecaptchaSubmit(response) {
		this.setState({ recaptcha: response });
	}

	getEmail() {
		return this.state.email === null ? userInfo.email : this.state.email;
	}

	handleSubmit(event){
		event.preventDefault();
		let { message, recaptcha } = this.state;

		if (this.validate()) {
			this.setState({ submitting: true, touched: true });
			socket.send('sendSupport', {email: this.getEmail(), message, recaptcha})
			.then(() => {
					this.setState({ submitting: false});
					browserHistory.push('/');
					notification.setMessage(<span><span className="green-tag">Success!</span> Your message has been sent.</span>);
				},
				error => {
					this.setState({ submitting: false});
					console.error('Unexpected server error: ' + error);
					notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {error}.</span>, 'error');
				}
			)
		}

	}

  render() {
		const { message, emailError, messageError, recaptcha } = this.state;

		let unameInstance = '';

		if (userInfo.uname) {
			unameInstance = (
				<FormGroup>
					<InputGroup>
						<InputGroup.Addon>
							Username:
						</InputGroup.Addon>
						<input type="text"
									 className="form-control"
									 value={userInfo.uname}
									 readOnly
									 disabled
						/>
					</InputGroup>
				</FormGroup>
			)
		}

		if (!userInfo.uname) {
			unameInstance = (
				<p className="red-color"><span className="hl-word">Not logged in.</span> This support message won't be attached to an account. If it is about your account, please <Link to="/login">log in</Link>.</p>
			)
		}

    return (
			<Form horizontal onSubmit={(event) => this.handleSubmit(event)}>

			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
      <h4>We're here to help</h4>
			<p>Check our <Link to="/faq">FAQ</Link>. Didn't find an answer? Submit a message through this form and we will email you back.</p>
      <Col xs={24} sm={20}>
				{unameInstance}
				{ emailError && <strong className="red-error">{emailError}</strong>}
        <FormGroup className={emailError ? 'has-error' : ''}>
          <InputGroup>
            <InputGroup.Addon>
              E-mail:
            </InputGroup.Addon>
            <input type="text"
                   className="form-control"
									 placeholder="name@domain.com"
                   value={this.getEmail()}
									 ref={(input) => { this.firstInput = input; }}
									 onChange={(event) => this.onEmailChange(event)}
						/>
          </InputGroup>
        </FormGroup>
				{ messageError && <strong className="red-error">{messageError}</strong>}
				<FormGroup className={messageError ? 'has-error' : ''}>
					<InputGroup>
						<InputGroup.Addon>
							Message:
						</InputGroup.Addon>
						<textarea type="text"
											className="form-control"
											value={message}
											onChange={(event) => this.onMessageChange(event)}
						/>
					</InputGroup>
				</FormGroup>
				<Col xs={24} xsOffset={0} sm={20} smOffset={2} md={16} mdOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<ReCAPTCHA
						ref="recaptcha"
						sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
						callback={ (response) => this.onRecaptchaSubmit(response) }
						expiredCallback={ () => console.error('recaptcha expired..') }
					/>
				</Col>
      </Col>
			<Col xs={16} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<button className='btn btn-success btn-lg' type="submit"
								disabled={ !recaptcha || this.state.submitting }>
					{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
				</button>
			</Col>
    </div>
			</Form>
    )
  }
}

export default refresher(Support,
	[userInfo, 'UNAME_CHANGED']
);
