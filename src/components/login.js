import React, { PureComponent } from 'react'
import { Form, FormGroup, Col, InputGroup } from 'react-bootstrap'
import { validateUname, validatePasscode, validatePassword } from '../util/belt'
import socket from '../socket'
import { browserHistory, Link } from 'react-router'
import userInfo from '../core/userInfo';
import notification from '../core/notification'


class LoginForm extends PureComponent {
  constructor(props) {
    super(props);
		this.firstInput = null; // this is a ref
    this.state = {
      uname: '',
      password: '',
			passcode: '',
      error: null,
      unameError: null,
      passwordError: null,
			mfaRequired: null,
			passcodeError: null,
			submitting: false,
			touched: false
    };
  }
	componentDidMount(){
		this.firstInput.focus();
	}
// this returns true if the form is valid
  validate(values) {
    let isValid = true;
    
    const unameError = validateUname(values.uname);
    this.setState({
      unameError
    });
    isValid = isValid && !unameError;

    const passwordError = validatePassword(values.password);
    this.setState({
      passwordError
    });
    isValid = isValid && !passwordError;

    if (this.state.mfaRequired) {
			const passcodeError = validatePasscode(values.passcode);
			this.setState({
				passcodeError
			});
			isValid = isValid && !passcodeError;
		}

    return isValid;
  }

  validatePasscode(values) {
		const passcodeError = validatePasscode(values.passcode);
		this.setState({
			passcodeError
		});
		return !passcodeError;
	}

  onUnameChange(event) {
    const uname = event.target.value;
    const unameError = this.state.touched ? validateUname(uname) : null;
    this.setState({uname, unameError});
  }

  onPasswordChange(event) {
		const password = event.target.value;
    const passwordError = this.state.touched ? validatePassword(password) : null;
    this.setState({password, passwordError});
  }

	onPasscodeChange(event) {
		const passcode = event.target.value;
		const passcodeError = this.state.touched ? validatePasscode(passcode) : null;
		this.setState({passcode, passcodeError});
	}

  _handleLogin(e) {
    e.preventDefault();
    if (!this.validate(this.state)) {
    	console.warn('Not logging in because of an error.');
    	return;
		}
		this.setState({ submitting: true, touched: true });

		let {uname, password, passcode} = this.state;

      return socket
        .send('login', {uname, password, passcode})
        .then(info => {
          userInfo.logIn(info.userInfo);
					this.setState({ submitting: false });
          browserHistory.push('/');
          localStorage.setItem('secret', info.sessionId);
					notification.setMessage(<span><span className="green-tag">Welcome Back {uname}! </span> You are now logged in.</span>);
        }, err => {
					this.setState({ submitting: false });

					switch (err) {
						case 'INVALID_USERNAME':
							this.setState({
								unameError: 'This username doesn\'t exist.'
							});
							break;
						case 'INVALID_PASSWORD':
							this.setState({
								passwordError: 'The password is incorrect.'
							});
							break;

						case 'MFA_REQUIRED':
							this.setState({
								mfaRequired: 'MFA is required to log in.'
							});
							break;
						case 'INVALID_PASSCODE':
							this.setState({
								passcodeError: 'The passcode is incorrect.'
							});
							break;
						default:
							console.error(err);
							notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
					}
        })

  }

  requireMfa() {
		const { mfaRequired, passcodeError }  = this.state;
		if (mfaRequired) {
			return (
				<Col xs={16} xsOffset={4}>
					{ passcodeError && <strong className="red-error">{passcodeError}</strong>}
					<FormGroup className={passcodeError ? 'has-error' : ''}>
						<InputGroup>
							<InputGroup.Addon>
								2FA Code:
							</InputGroup.Addon>
							<input type="number" min="0" max="999999"
										 placeholder="Passcode"
										 name="passcode"
										 className="form-control"
										 value={this.state.passcode}
										 onChange={(event) => this.onPasscodeChange(event)}
							/>
						</InputGroup>
					</FormGroup>
				</Col>
			);
		}
	}

	startingFields(){
		const { unameError, passwordError, mfaRequired }  = this.state;
		if (!mfaRequired) {
			return (
				<div>
					<Col xs={16} xsOffset={4}>
						{ unameError && <strong className="red-error">{unameError}</strong>}
						<FormGroup className={unameError ? 'has-error' : ''}>
							<InputGroup>
								<InputGroup.Addon>
									Uname:
								</InputGroup.Addon>
								<input type="text"
											 placeholder="uname"
											 className="form-control"
											 value={this.state.uname}
											 ref={(input) => { this.firstInput = input; }}
											 onChange={(event) => this.onUnameChange(event)}
								/>
							</InputGroup>
						</FormGroup>
					</Col>
					<Col xs={16} xsOffset={4}>
						{ passwordError && <strong className="red-error">{passwordError}</strong>}
					<FormGroup className={passwordError ? 'has-error' : ''}>
						<InputGroup>
							<InputGroup.Addon>
								Password:
							</InputGroup.Addon>
							<input type="password"
										 placeholder="password"
										 name="password"
										 className="form-control"
										 value={this.state.password}
										 onChange={(event) => this.onPasswordChange(event)}
							/>
						</InputGroup>
					</FormGroup>
					</Col>
				</div>
		);
		}
	}

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Col xs={12}>
        <h4 className="text-center">Welcome Back!</h4>
        </Col>
        <Form horizontal onSubmit={(e) => this._handleLogin(e)}>
					{this.startingFields()}
					{this.requireMfa()}
          <Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <button className='btn btn-success btn-lg' type="submit" disabled={ this.state.submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
							</button>
          </Col>
        </Form>
        <Col xs={24} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Link to="/forgot-password">Forgot Password</Link>
        </Col>
      </div>
    );
  }
}




export default LoginForm;
