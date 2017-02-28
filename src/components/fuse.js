import React, { Component } from 'react'
import { Col, Form, FormGroup, InputGroup } from 'react-bootstrap'
import { Link, browserHistory } from 'react-router'
import userInfo from '../core/userInfo'
import refresher from '../refresher';
import NotLoggedIn from './not-logged-in-well'
import socket from '../socket'
import confirm from '../util/confirmation'
import notification from '../core/notification'
import { formatBalance } from '../util/belt'


function validateAmount(amount) {

	if (!amount)
		return 'Please enter the amount of valor and silver to fuse.';

	if (amount > userInfo.valor && amount > userInfo.silver)
		return 'You don\'t have enough valor or silver to perform this fusion.';

	if (amount > userInfo.valor)
		return 'You don\'t have enough valor to perform this fusion.';

	if (amount > userInfo.silver)
		return 'You don\'t have enough silver to perform this fusion.';
}

class Fuse extends Component {
	constructor(props) {
		super(props);
		this.firstInput = null; // this is a ref
		this.state = {
			amount: 0,
			error: null,
			amountError: null,
			maxFusionAmount: Math.min(userInfo.valor, userInfo.silver),
			submitting: false,
			touched: false
		};
	}

	componentDidMount(){
			this.firstInput.focus();
	}

	validate(values) {
		const amountError = validateAmount(values.amount);
		this.setState({amountError});
		return !amountError;

	}

	onAmountChange(event) {
		const amount = event.target.value;
		const amountError = this.state.touched ? validateAmount(amount) : null;
		this.setState({amount, amountError});
	}

	handleSubmit(event) {
		event.preventDefault();
		let { amount } = this.state;

		if (this.validate(this.state)) {

			amount = Number.parseFloat(amount);
			this.setState({ submitting: true, touched: true });

			const confirmMessage = 'Are you sure you want to fuse ' +
				amount +' valor with '+ amount +' silver? This will result in '+ amount + (amount > 1 ? ' bits.' : ' bit.');

			confirm(confirmMessage).then(
				(result) => {
					console.log(result);

					socket.send('fuse', {amount})
						.then(() => {
								console.log('Requested fusion: ', amount);
								this.setState({ submitting: false});
								browserHistory.push('/');
								notification.setMessage(<span><span className="green-tag">Success!</span> You have fused valor and silver into {amount} {amount > 1 ? ' bits.' : ' bit.'}</span>);
							},
							err => {
								console.error('Unexpected server error: ' + err);
								this.setState({ submitting: false});
								notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
							}
						)
				},
				(result) => {
					this.setState({ submitting: false });
					console.log(result)
				}
			)
		}
	}

	maxFusionAmount() {
		this.setState({amount: this.state.maxFusionAmount });
	}

	render() {
		const {amountError, amount, maxFusionAmount}  = this.state;

		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Col xs={20} style={{ marginBottom: '20px'}}>
					<h4 className="text-left">Available:</h4>
					<Col sm={12} xs={24}>
						<Col xs={16}><span className="key-muted"><i className="fa fa-shield valor-color" aria-hidden="true"></i> Valor: </span></Col>
						<Col xs={8}><span className="bold">{ formatBalance(userInfo.valor)}</span></Col>
					</Col>
					<Col sm={12} xs={24}>
						<Col xs={16}><span className="key-muted"><i className="fa fa-superpowers silver-color" aria-hidden="true"></i> Silver: </span></Col>
						<Col xs={8}><span className="bold">{formatBalance(userInfo.silver)}</span></Col>
					</Col>
				</Col>
				{ amountError && <strong className="red-error">{amountError}</strong>}
				<Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
					<Col xs={17} xsOffset={2}>
						<FormGroup className={amountError ? 'has-error' : ''}>
							<InputGroup>
								<InputGroup.Addon>
									Amount:
								</InputGroup.Addon>
								<input type="number"
											 placeholder="400"
											 className="form-control"
											 value={maxFusionAmount ? maxFusionAmount : amount}
											 ref={(input) => { this.firstInput = input; }}
											 onChange={(event) => this.onAmountChange(event)}
								/>
								<InputGroup.Addon>
									valor + silver
								</InputGroup.Addon>
							</InputGroup>
						</FormGroup>
					</Col>
					<Col xs={2} xsOffset={1}>
						<FormGroup className={amountError ? 'has-error' : ''}>
							<InputGroup>
								<InputGroup.Button>
									<button className="btn btn-default form-control" type="button"
													onClick={() => this.maxFusionAmount()}>
										Max
									</button>
								</InputGroup.Button>
							</InputGroup>
						</FormGroup>
					</Col>
					<Col xs={20} xsOffset={2} className="well">
						<Col xs={24} className="text-center">
							<p className="key-muted">How do fusions work?</p>
							<p>1 valor + 1 silver = 1 bit</p>
							<p className="key-muted">Your fusion:</p>
							<p>{amount} valor + {amount} silver = {amount} {amount > 1 ? 'bits' : 'bit'}</p>
						</Col>
					</Col>

					<Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<button className='btn btn-success btn-lg' type="submit" disabled={ this.state.submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
						</button>
					</Col>
				</Form>

				<Col xs={24} sm={20}>
					<p className="text-muted" style={{alignSelf: 'flex-start'}}><span className="hl-word">Hint: </span>If you
						want to learn more about fusions, click <Link to="/faq/how-to-fuse">here</Link>.</p>
					<p className="text-muted" style={{alignSelf: 'flex-start'}}>
						If you want to check your fusion history, check your <Link to="/account/overview"> account overview.</Link>
					</p>
				</Col>
			</div>
		);
	}
}

function fuseWrapper() {
	if (!userInfo.uname) { return <NotLoggedIn/> }
	return <Fuse />
}


export default refresher(fuseWrapper,
	[userInfo, 'UNAME_CHANGED', 'BALANCE_CHANGED']
);