import React, { Component, PropTypes } from 'react'
import { Form, FormControl, Col, FormGroup, InputGroup } from 'react-bootstrap'
import { validateUname, formatBalance } from '../util/belt'
import { tipFee } from '../util/config'
import { Link, browserHistory } from 'react-router'
import confirm from '../util/confirmation'
import notification from '../core/notification'
import socket from '../socket'
import refresher from '../refresher';
import NotLoggedIn from './not-logged-in-well'
import userInfo from '../core/userInfo'


function validateAmount(amount) {
  if (!amount)
    return 'You must enter a tip amount (in bits).';

  if (amount < 1)
    return 'The amount to tip must be at least 1 bit.';

  const isNumberRegex = /^[1-9]\d*$/; // handle against leading zeros

  if (!isNumberRegex.test(amount))
    return 'The amount is not a valid number.'
}




class Tip extends Component {

  constructor(props) {
    super(props);
		this.firstInput = null; // this is a ref
    this.state = {
      amount: '',
      currency: 'BALANCE',
      recipient: this.props.location.query.uname || '',
      error: null,
      amountError: null,
      recipientError: null,
      tipFee,
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
    const amountError = validateAmount(values.amount);
    this.setState({
      amountError
    });
    isValid = isValid && !amountError;
    const recipientError = validateUname(values.recipient);
    this.setState({
      recipientError
    });
    isValid = isValid && !recipientError;
    return isValid;
  }

  onAmountChange(event) {
    const amount = event.target.value;
    const amountError = this.state.touched ? validateAmount(amount) : null;
    this.setState({amount, amountError});
  }

  onRecipientChange(event) {
    const recipient = event.target.value;
    const recipientError = this.state.touched ?  validateUname(recipient) : null;
    this.setState({recipient, recipientError});
  }


  handleSubmit(event) {
    event.preventDefault();
    let {amount, currency, recipient} = this.state;

    if (this.validate(this.state)) {
      amount = Number.parseInt(amount, 10) * 100;
			this.setState({ submitting: true, touched: true });

      const confirmMessage = 'Are you sure you want to send a tip of ' +
        formatBalance(amount) + ' ' + currency + ' to '+ recipient + '? Consider you will also be paying a tip fee of '
        + formatBalance(tipFee)+(tipFee !== 100 ? ' bits.' : ' bit.');


      confirm(confirmMessage).then(
        (result) => {
          console.log(result);
          socket.send('tip', {amount, currency, uname: recipient})
            .then(() => {
                console.log('Tip: ', amount,' sent to ',recipient);
								this.setState({ submitting: false });
                browserHistory.push('/');
                notification.setMessage(<span><span className="green-tag">Success!</span> The tip for {recipient} has been sent.</span>);
              },
              error => {
								this.setState({ submitting: false });
								switch (error) {
									case "NOT_ENOUGH":
										console.error('You don\'t have enough ' + currency);
										notification.setMessage(<span><span className="red-tag">Error </span> You don't have enough {currency.toLowerCase()}.</span>, 'error');
										break;
									case "NO_SUCH_USER":
										console.error('The username ' + recipient + ' doesn\'t exist.');
										notification.setMessage(<span><span className="red-tag">Error </span> The username {recipient} doesn't exist.</span>, 'error');
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
  }

  maxTipAmount() {
    const { currency } = this.state;
    let { tipFee } = this.state;
    tipFee = Number.parseFloat(tipFee);

    let max = 0;

    switch (currency) {
      case "BALANCE":
        max = userInfo.balance - tipFee;
        this.setState({amount: max / 100 });
        console.log('Bits selected and the max is: '+ formatBalance(max));
        break;
      case "VALOR":
        max = userInfo.valor;
        this.setState({amount: max });
        console.log('Valor selected and the max is: '+ max);
        break;
      case "SILVER":
        max = userInfo.silver;
        this.setState({amount: max });
        console.log('Silver selected and the max is: '+ max);
        break;
      default:
        console.log('Something went wrong here.');
    }


  }

  render() {

    const {amountError, recipientError}  = this.state;

		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
					<Col xs={20} xsOffset={2} style={{padding: 0}}>
						<h5>Send:</h5>
						<Col xs={11}>
							{ amountError && <strong className="red-error">{amountError}</strong>}
							<FormGroup className={amountError ? 'has-error' : ''}>
								<InputGroup>
									<InputGroup.Addon>
										Amount:
									</InputGroup.Addon>
									<input type="text"
												 placeholder="400"
												 className="form-control"
												 value={this.state.amount}
												 ref={(input) => { this.firstInput = input; }}
												 onChange={(event) => this.onAmountChange(event)}
									/>
								</InputGroup>
							</FormGroup>
						</Col>
						<Col xs={9} xsOffset={1}>
							<FormGroup>
								<InputGroup>
									<InputGroup.Addon>
										Currency:
									</InputGroup.Addon>
									<FormControl componentClass="select"
															 value={this.state.currency}
															 onChange={(event) => this.setState({currency: event.target.value})}
									>
										<option value="BALANCE">Bits</option>
										<option value="VALOR">Valor</option>
										<option value="SILVER">Silver</option>
									</FormControl>
								</InputGroup>
							</FormGroup>
						</Col>
						<Col xs={2} xsOffset={1}>
							<FormGroup>
								<InputGroup>
									<InputGroup.Button>
										<button className="btn btn-default form-control" type="button"
														onClick={() => this.maxTipAmount()}>
											Max
										</button>
									</InputGroup.Button>
								</InputGroup>
							</FormGroup>
						</Col>
					</Col>

					<Col xs={20} xsOffset={2}>
						<h5>To:</h5>
						{ recipientError && <strong className="red-error">{recipientError}</strong>}
						<FormGroup className={recipientError ? 'has-error' : ''}>
							<InputGroup>
								<InputGroup.Addon>
									Recipients's Username:
								</InputGroup.Addon>
								<input type="text"
											 className="form-control"
											 value={this.state.recipient}
											 onChange={(event) => this.onRecipientChange(event)}
								/>
							</InputGroup>
						</FormGroup>
					</Col>

					<Col xs={20} xsOffset={2} className="well">
						<Col xs={12}>Tip Fee: <small><Link to="/faq/tip-fee">What is this?</Link></small></Col>
						<Col xs={12}>{formatBalance(tipFee)}{ tipFee !== 100 ? ' bits' : ' bit' }</Col>
					</Col>

					<Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<button className='btn btn-success btn-lg' type="submit"
										disabled={ this.state.submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
						</button>
					</Col>
				</Form>

				<Col xs={24} sm={20}>
					<p className="text-muted" style={{alignSelf: 'flex-start'}}><span className="hl-word">Hint: </span>If you
						don't know how to send a tip, check the procedure <Link to="/faq/how-to-tip">here</Link>.</p>
				</Col>
				<Col sm={6} xs={12} style={{marginTop: '20px'}}>
					<Link className="btn btn-info" to="/transactions/tips"><i className="fa fa-history"></i> History</Link>
				</Col>

			</div>
		);
	}
}

Tip.propTypes = {
	uname: PropTypes.string // comes from React Router location.query, mainly from PopoverMenu component
};

function tipWrapper(props) {
	if (!userInfo.uname) { return <NotLoggedIn/> }
	return <Tip {...props} />
}

export default refresher(tipWrapper,
  [userInfo, 'UNAME_CHANGED', 'BALANCE_CHANGED']
);