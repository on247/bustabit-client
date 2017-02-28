import React, { Component } from 'react'
import { Row, Col, Form, FormGroup, InputGroup } from 'react-bootstrap'
import { Link, browserHistory } from 'react-router'
import userInfo from '../core/userInfo'
import refresher from '../refresher';
import NotLoggedIn from './not-logged-in-well'
import socket from '../socket'
import { formatBalance } from '../util/belt'
import confirm from '../util/confirmation'
import notification from '../core/notification'
import {  withdrawalFee, instantWithdrawalFee } from '../util/config'
import browserSize from '../core/browser-size'



function validateBtcAddress(address) {
  if (!address)
    return 'Please enter your bitcoin address for us to send your bits.';
}



class Withdraw extends Component {
	constructor(props) {
		super(props);
		this.firstInput = null; // this is a ref
		this.state = {
			amount: null, // when it's null, render max withdrawal
			address: '',
			instantWithdrawal: false,
			error: null,
			amountError: null,
			addressError: null,
			submitting: false,
			touched: false
		};
	}
	componentDidMount(){
		this.firstInput.focus();
	}

	validateAmount(amount) {

		if (!amount)
			return 'Please enter the amount of bits to withdraw.';

		if (amount < 400)
			return 'The minimum amount for withdrawal is 400 bits.';

		let total = Number.parseFloat(this.getTotal());


		if (total > userInfo.balance)
			return 'You don\'t have enough balance.';

		console.log('the total is: ',total)
		console.log('get total func is', this.getTotal())
		console.log('user balance is: ', userInfo.balance)
	}

	validate() {
		let isValid = true;

		const amountError = this.validateAmount(this.getAmount());

		this.setState({
			amountError
		});
		isValid = isValid && !amountError;


		const addressError = validateBtcAddress(this.state.address);

		this.setState({
			addressError
		});
		isValid = isValid && !addressError;


		return isValid;

	}

	onAmountChange(event) {
		const amount = event.target.value;
		const amountError = this.state.touched ? this.validateAmount(amount) : null;
		this.setState({amount, amountError});
	}

	onAddressChange(event) {
		const address = event.target.value;
		const addressError = this.state.touched ? validateBtcAddress(address) : null;
		this.setState({address, addressError});
	}


	handleSubmit(event) {
		event.preventDefault();
		let { address, instantWithdrawal } = this.state;
		let amount = this.getAmount();

		if (this.validate()) {
			this.setState({ submitting: true, touched: true });
			amount = Number.parseFloat(amount) * 100;

      const confirmMessage = 'Are you sure you want to withdraw ' +
        formatBalance(amount)+' bits? Your total withdrawal would be '+
        this.getTotal()+' bits. (Including the '+ formatBalance(withdrawalFee)+' bits withdrawal fee).';


      confirm(confirmMessage).then(
        (result) => {
          console.log(result);
          socket.send('withdraw', {amount, address, instantWithdrawal})
            .then(() => {
                console.log('Requested withdrawal: ', amount);
								this.setState({ submitting: false});
                browserHistory.push('/');
                notification.setMessage('We are now processing your withdrawal.');
              },
              error => {
								this.setState({ submitting: false });
								switch (error) {
									case "INVALID_ADDRESS":
										console.error('The address ' + address + ' is not valid.');
										notification.setMessage(<span><span className="red-tag">Error </span> The address {address} is not valid. Please try again. </span>, 'error');
										break;
									default:
										console.error('Unexpected server error: ' + error);
										notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {error}.</span>, 'error');
								}
              }
            )
        },
        (result) => {
					this.setState({ submitting: false });
          console.log(result)
        }
      )
		}

		console.log('The information submitted is: Amount: ', amount, ' Address: ', address);
	}

	getTotal() {
	  let { amount } = this.state;
	  const { instantWithdrawal } = this.state;
	  amount = ( Number.parseFloat(amount) || 0 )  * 100;

    const total = amount + withdrawalFee + ( instantWithdrawal ? instantWithdrawalFee : 0 );
    return total;
  }

  // returns a string for the input box
  getAmount() {
		const { amount } = this.state;
		if ( amount === null ) {
			const { instantWithdrawal } = this.state;
			const max = Math.floor(userInfo.balance - withdrawalFee - (instantWithdrawal ? instantWithdrawalFee : 0));
			return (max / 100 ).toFixed(2);
		}
		return amount;
	}

	changeInstantWithdrawalSelected(){
		this.setState({instantWithdrawal: !this.state.instantWithdrawal});

	}


	render() {
		const {amountError, addressError, address, amount, instantWithdrawal}  = this.state;

		const total = this.getTotal();

		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' , marginTop: '20px'}}>
				<Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
					<Col xs={20} xsOffset={2}>
						{ addressError && <strong className="red-error">{addressError}</strong>}
						<FormGroup className={addressError ? 'has-error' : ''}>
							<InputGroup className="responsive-input-group">
								<InputGroup.Addon>
									Bitcoin Address:
								</InputGroup.Addon>
								<input type="text"
											 className="form-control"
											 value={address}
											 ref={(input) => { this.firstInput = input; }}
											 onChange={(event) => this.onAddressChange(event)}
								/>
							</InputGroup>
						</FormGroup>
					</Col>

					<Col xs={20} xsOffset={2}>
						{ amountError && <strong className="red-error">{amountError}</strong>}
						<Row>
						<Col sm={20} xs={24}>
							<FormGroup className={amountError ? 'has-error' : ''}>
								<InputGroup>
									{ browserSize.isMobile() ? '' : <InputGroup.Addon>Amount:</InputGroup.Addon>}
									<input type="number"
												 placeholder="400"
												 className="form-control"
												 value={this.getAmount()}
												 onChange={(event) => this.onAmountChange(event)}
									/>
									<InputGroup.Addon>
										bits
									</InputGroup.Addon>
								</InputGroup>
							</FormGroup>
						</Col>
						<Col sm={3} smOffset={1} xs={24}>
							<FormGroup className={amountError ? 'has-error' : ''}>
								<InputGroup>
									<InputGroup.Button>
										<button className="btn btn-danger form-control" type="button"
														onClick={() => this.setState({ amount: null})}>
											Max
										</button>
									</InputGroup.Button>
								</InputGroup>
							</FormGroup>
						</Col>
						</Row>
					</Col>
					<Col xs={17} xsOffset={2} style={{marginBottom: '15px'}}>
						<div className="checkbox">
							<label>
								<input type="checkbox"
											 checked={instantWithdrawal}
											 onChange={() => this.changeInstantWithdrawalSelected()}

								/>
								Instant Withdrawal ( + {formatBalance(instantWithdrawalFee)} bits )
							</label>
						</div>
					</Col>

					<Col xs={20} xsOffset={2} className="well">
						<Col xs={12}>Amount to Withdraw: </Col>
						<Col xs={12}>{amount} bits</Col>
						<Col xs={12}>Withdrawal Fee: <small><Link to="/faq/withdrawal-fee">What is this?</Link></small></Col>
						<Col xs={12}>{formatBalance(withdrawalFee)} bits</Col>
						<Col xs={12}>Instant Withdrawal Fee:</Col>
						<Col xs={12} className="bold">{ instantWithdrawal ? formatBalance(instantWithdrawalFee) : 0 } bits</Col>
						<Col xs={12}>Total:</Col>
						<Col xs={12} className={ total > userInfo.balance ? "bold red-color" : "bold"}>{formatBalance(total)} bits</Col>
					</Col>



					<Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<button className='btn btn-success btn-lg' type="submit" disabled={ this.state.submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
						</button>
					</Col>
				</Form>

				<Col xs={24} sm={20}>
					<p className="text-muted" style={{alignSelf: 'flex-start'}}><span className="hl-word">Important: </span>
						Your withdrawal will be sent from the hot wallet, do not withdraw to any site that uses the sending address, or returns to sender, because any returns will probably be credited to a different player.</p>
					<p className="text-muted" style={{alignSelf: 'flex-start'}}><span className="hl-word">Hint: </span>If you
						don't know how to withdraw, check the procedure <Link to="/faq/how-to-withdraw">here</Link>.</p>
					<p className="text-muted" style={{alignSelf: 'flex-start'}}>
					If you want to check your past withdrawals and their status:
					<span style={{marginLeft: '5px'}}>
						<Link className="btn btn-info btn-xs" to="/transactions/withdrawals">
							<i className="fa fa-history"></i> History</Link>
					</span>
				</p>
				</Col>
			</div>
		);
	}
}

function withdrawWrapper() {
	if (!userInfo.uname) { return <NotLoggedIn/> }
	return <Withdraw />
}


export default refresher(withdrawWrapper,
	[userInfo, 'UNAME_CHANGED', 'BALANCE_CHANGED'],
	[browserSize, 'WIDTH_CHANGED']
);