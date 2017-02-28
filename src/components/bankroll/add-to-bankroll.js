import React, { PureComponent } from 'react'
import { Col, Form, FormGroup, InputGroup, Button } from 'react-bootstrap'
import { Link, browserHistory } from 'react-router'
import socket from '../../socket'
import userInfo from '../../core/userInfo'
import engine   from '../../core/engine'
import refresher from '../../refresher'
import notification from '../../core/notification'
import confirm from '../../util/confirmation'

import { isAmountInvalid, formatBalance } from '../../util/belt'


class AddToBankroll extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      amountError: null,
			submitting: false,
			touched: false
		};
  }
	componentDidMount(){
		this.firstInput.focus();
	}

  onAmountChange(event) {
    const amount = event.target.value;
    const amountError = this.state.touched ? isAmountInvalid(amount, 1e6, userInfo.balance) : null;
    this.setState({amount, amountError});
  }

  /// this returns true if the form is valid
  validate(values) {
    const amountError = isAmountInvalid(values.amount, 1e6, userInfo.balance);
    this.setState({
      amountError
    });
    return !amountError;
  }

  handleSubmit(event) {
    event.preventDefault();
    let { amount } = this.state;

    if (this.validate(this.state)) {
			this.setState({ submitting: true, touched: true });

      amount = Number.parseFloat(amount) * 100; // convert to satoshis

      if (!Number.isFinite(amount)) {
        amount = Number.MAX_VALUE;
      }

      const confirmMessage = 'Are you sure you want to add ' +
				formatBalance(amount)+' bits to the Bankroll? You\'ll be paying a dilution fee of '+
				formatBalance(amount*.1)+' bits.';


			confirm(confirmMessage).then(
				(result) => {

					console.log(result);
					socket.send('invest', amount)
						.then(() => {
								this.setState({ submitting: false });
								console.log('Added to bankroll: ', amount);
								browserHistory.push('/');
								notification.setMessage('Added to bankroll: '+ formatBalance(amount));
							},
							err => {
								this.setState({ submitting: false });
								console.error('Unexpected server error: ' + err);
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
	maxAmount() {
		this.setState({amount: Math.floor(userInfo.balance / 100) });
	}

  render() {
    const { amountError }  = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Col xs={24} sm={20}>
          <h4>Add to Bankroll:</h4>
          <br/>
          <Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
          { amountError && <strong className="red-error">{amountError}</strong>}
          <Col xs={20}>
          <FormGroup className={amountError ? 'has-error' : ''}>
            <InputGroup>
              <InputGroup.Addon>
                Amount:
              </InputGroup.Addon>
              <input type="number"
                     placeholder="Amount"
                     className="form-control"
                     value={this.state.amount}
										 ref={(input) => { this.firstInput = input; }}
                     onChange={(event) => this.onAmountChange(event)}
              />
            </InputGroup>
          </FormGroup>
					</Col>
					<Col xs={3} xsOffset={1}>
						<FormGroup>
						<Button className="btn btn-warning"
										onClick={() => this.maxAmount()}
						>
							Max
						</Button>
						</FormGroup>
					</Col>
						<Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<button className='btn btn-success btn-lg' type="submit" disabled={ this.state.submitting }>
								{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
							</button>
						</Col>
          </Form>
        </Col>

        <Col xs={24} sm={20}>
          <p className="text-muted" style={{alignSelf: 'flex-start'}}><span className="hl-word">Hint: </span>If you
            want to learn more about the bankroll, click <Link to="/faq/how-does-the-bankroll-work">here</Link>.</p>
        </Col>
        <Col sm={6} xs={12} style={{marginTop: '20px'}}>
          <Link className="btn btn-info" to="/bankroll/history"><i className="fa fa-history"></i> History</Link>
        </Col>
      </div>);
  }

}

export default refresher(AddToBankroll,
  [userInfo, 'BANKROLL_STATS_CHANGED', 'BALANCE_CHANGED'],
  [engine, 'BANKROLL_CHANGED']
);
