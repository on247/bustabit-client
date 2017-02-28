import React, { Component, PropTypes } from 'react';
import { Form, Col, Row, FormGroup, InputGroup } from 'react-bootstrap'
import socket from '../../socket'
import notification from '../../core/notification'
import { validateUname } from '../../util/belt'
import {  browserHistory } from 'react-router'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';
import NotLoggedIn from '../not-logged-in-well'


function validateWagerRequirement(bits) {
	if (!bits) {
		return 'Please write an wager requirement in bits.'
	}

	if (bits < 0) {
		return 'Please write a valid wager requirement amount in bits.'
	}
}

function validateReason(reason) {
	if (!reason) {
		return 'Please write a reason for muting this user.'
	}
}

class Mute extends Component {

	constructor(props) {
		super(props);
		this.firstInput = null; // this is a ref
		this.state = {
			uname: this.props.location.query.uname || '',
			unameError: '',
			wagerRequirement: '',
			wagerRequirementError: '',
			reason: '',
			reasonError: '',
			submitting: false,
			touched: false

		};
	}
	componentDidMount(){
		this.firstInput.focus();
	}

	// this returns true if the form is valid
	validate(values) {
		const unameError = validateUname(values.uname);
		this.setState({unameError});
		return !unameError;
	}

	onUnameChange(event) {
		const uname = event.target.value;
		const unameError = this.state.touched ? validateUname(uname) : null;
		this.setState({uname, unameError});
	}

	onReasonChange(event) {
		const reason = event.target.value;
		const reasonError = this.state.touched ? validateReason(reason) : null;
		this.setState({reason, reasonError});
	}

	onWagerRequirementChange(event) {
		const wagerRequirement = event.target.value;
		const wagerRequirementError = this.state.touched ? validateWagerRequirement(wagerRequirement) : null;
		this.setState({wagerRequirement, wagerRequirementError});
	}

	handleSubmit(event) {
		event.preventDefault();
		let {uname, wagerRequirement, reason} = this.state;

		if (this.validate(this.state)) {
			this.setState({ submitting: true, touched: true });
			wagerRequirement = Number.parseFloat(wagerRequirement) * 100; // convert to satoshis
			return socket
				.send('mute', { uname, wagerRequirement, reason })
				.then(info => {
					notification.setMessage(<span>The user <span className="red-color">{uname}</span> has been muted.</span>);
					this.setState({ submitting: false });
					browserHistory.push('/');
				}, err => {
					this.setState({ submitting: false });
					if (err === 'UNAME_NOT_FOUND') {
						this.setState({
							unameError: 'This username doesn\'t exist.'
						})
					}
					else {
						console.error(err);
						notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
					}
				})
		}
	}

	render() {
		const { uname, unameError, wagerRequirement, wagerRequirementError, reason, reasonError } = this.state;
		return (
			<Row>
				<Col md={12} mdOffset={6} sm={18} smOffset={3} xs={22} xsOffset={1}>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<Form horizontal className="text-center" onSubmit={(event) => this.handleSubmit(event)}>

							{ unameError && <strong className="red-error">{unameError}</strong>}
							<FormGroup className={unameError ? 'has-error' : ''}>
								<InputGroup className="responsive-input-group">
									<InputGroup.Addon>
										Username:
									</InputGroup.Addon>
									<input type="text"
												 placeholder="Username"
												 className="form-control"
												 value={uname}
												 ref={(input) => { this.firstInput = input; }}
												 onChange={(event) => this.onUnameChange(event)}
									/>
								</InputGroup>
							</FormGroup>

							{ wagerRequirementError && <strong className="red-error">{wagerRequirementError}</strong>}
							<FormGroup className={wagerRequirementError ? 'has-error' : ''}>
								<InputGroup className="responsive-input-group">
									<InputGroup.Addon>
										Wager Requirement:
									</InputGroup.Addon>
									<input type="text"
												 placeholder="1000"
												 className="form-control"
												 value={wagerRequirement}
												 onChange={(event) => this.onWagerRequirementChange(event)}
									/>
									<InputGroup.Addon>
										bits
									</InputGroup.Addon>
								</InputGroup>
							</FormGroup>

							{ reasonError && <strong className="red-error">{reasonError}</strong>}
							<FormGroup className={reasonError ? 'has-error' : ''}>
								<InputGroup className="responsive-input-group">
									<InputGroup.Addon>
										Reason:
									</InputGroup.Addon>
									<input type="text"
												 placeholder="Why is this user being muted?"
												 className="form-control"
												 value={reason}
												 onChange={(event) => this.onReasonChange(event)}
									/>
								</InputGroup>
							</FormGroup>


							<button type="submit"
											className="btn btn-danger"
											style={{marginTop: '15px'}}
											disabled={ this.state.submitting }>
								{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Mute'}
							</button>
						</Form>
					</div>
				</Col>
			</Row>
		)
	}
}

Mute.propTypes = {
	uname: PropTypes.string // comes from React Router location.query, for PopoverMenu component
};
function muteWrapper(props) {
	if (!userInfo.uname) { return <NotLoggedIn/> }
	return <Mute {...props} />
}

export default refresher(muteWrapper,
	[userInfo, 'UNAME_CHANGED']
);