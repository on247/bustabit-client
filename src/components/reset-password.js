import React, { Component, PropTypes } from 'react'
import { Form, FormGroup, Col, InputGroup } from 'react-bootstrap'
import { randomPassword, validatePassword } from '../util/belt'
import socket from '../socket'
import { browserHistory } from 'react-router'
import notification from '../core/notification'



class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
      forgotPasswordToken: this.props.params.uuid,
			password: randomPassword(10),
			passwordError: '',
			error: null

		};
	}

// this returns true if the form is valid
	validate(values) {
		const passwordError = validatePassword(values.password);
		this.setState({
			passwordError
		});
		return !passwordError;
	}

	generate() {
		this.setState({password: randomPassword(10)});
	}

	_handleLogin(e) {
		e.preventDefault();
		if (this.validate(this.state)) {
			let { password, forgotPasswordToken } = this.state;
			return socket
				.send('resetPassword', {newPassword: password, forgotPasswordToken})
				.then(info => {
					browserHistory.push('/');
					notification.setMessage(<span><span className="green-tag">Success!</span> Your password has been successfully changed.</span>);
				}, err => {
						console.error('Unexpected server error: ' + err);
						notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
				})
		}
	}

	render() {
		const { passwordError }  = this.state;
		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Col xs={12}>
					<h4 className="text-center">Please select a new password.</h4>
				</Col>
				<Form horizontal onSubmit={(e) => this._handleLogin(e)}>
					<Col xs={16} xsOffset={4}>
						{ passwordError && <strong className="red-error">{passwordError}</strong>}
						<FormGroup className={passwordError ? 'has-error' : ''}>
							<InputGroup>
								<InputGroup.Addon>
									Password:
								</InputGroup.Addon>
								<input name="password"
											 type="text"
											 className="form-control"
											 readOnly
											 value={this.state.password}
								/>
								<InputGroup.Button>
									<button className="btn btn-default form-control" type="button" onClick={() => this.generate()}>
										<i className="fa fa-refresh"></i>
									</button>
								</InputGroup.Button>
							</InputGroup>
						</FormGroup>
					</Col>
					<Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<button className='btn btn-success btn-lg' type="submit">Submit</button>
					</Col>
				</Form>
			</div>
		);
	}
}

ResetPassword.propTypes = {
	params: PropTypes.object.isRequired // From react router - params.uuid
};

export default ResetPassword;