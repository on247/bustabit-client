import React, { Component } from 'react'
import { Form, FormControl, Col, FormGroup, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';
import socket from '../../socket'
import notification from '../../core/notification'
import { isAmountInvalid } from '../../util/belt'
import NotLoggedIn from '../not-logged-in-well'


class CreateTrade extends Component {

  constructor(props) {
    super(props);
		this.firstInput = null; // this is a ref
    this.state = {
      offerAmount: '',
      offerCurrency: 'VALOR',
      askAmount: '',
      askCurrency: 'BALANCE',
			error: null,
      offerAmountError: null,
      askAmountError: null,
			submitting: false,
			touched: false
    };
  }
	componentDidMount(){
		this.firstInput.focus();
	}

  // this returns true if the form is valid
  validate() {
    const offerAmountError = isAmountInvalid(this.state.offerAmount);
		const askAmountError = isAmountInvalid(this.state.askAmount);
		const error = this.state.offerCurrency === this.state.askCurrency ? 'Currencies must be different' : null;
		this.setState({
			error,  // clears any other global errors
			offerAmountError,
			askAmountError
    });
		const hasError = offerAmountError || askAmountError;
		return !hasError;
  }

  onOfferAmountChange(event) {
    const offerAmount = event.target.value;
    const offerAmountError = this.state.touched ? isAmountInvalid(offerAmount) : null;
    this.setState({offerAmount, offerAmountError});
  }

  onAskAmountChange(event) {
    const askAmount = event.target.value;
    const askAmountError = this.state.touched ? isAmountInvalid(askAmount) : null ;
    this.setState({askAmount, askAmountError});
  }


  handleSubmit(event) {
    event.preventDefault();
    let { offerAmount, offerCurrency, askAmount, askCurrency } = this.state;

    if (this.validate()) {
      offerAmount = Number.parseInt(offerAmount,10) * 100;
      askAmount = Number.parseInt(askAmount,10) * 100;
			this.setState({ submitting: true, touched: true });

			socket.send('createTrade', { offerAmount, offerCurrency, askAmount, askCurrency })
				.then(tradeId => {
					this.setState({ submitting: false });
					notification.setMessage(`Created trade ${tradeId}`)
				})
				.catch(error => {
					this.setState({ submitting: false });
					if (error === 'NOT_ENOUGH_AMOUNT') {
						this.setState({ offerAmountError: 'You don\'t have enough of this to send' });
						return;
					}

					this.setState({ error })
				})
    }
  }

  render() {
    const { error, offerAmount, offerCurrency, offerAmountError, askAmount, askCurrency, askAmountError }  = this.state;

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

        <Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
          <Col xs={20} xsOffset={2} style={{ padding: 0}}>
            <h5>Offer <span className="text-muted">(I'm willing to trade)</span>:</h5>
            <Col xs={12}>
              { offerAmountError && <strong className="red-error">{offerAmountError}</strong>}
            <FormGroup className={offerAmountError ? 'has-error' : ''}>
              <InputGroup>
                <InputGroup.Addon>
                  Amount:
                </InputGroup.Addon>
                <input type="text"
                       placeholder="1"
                       className="form-control"
											 ref={(input) => { this.firstInput = input; }}
                       value={ offerAmount }
                       onChange={event => this.onOfferAmountChange(event)}
                />
              </InputGroup>
            </FormGroup>
            </Col>
            <Col xs={11} xsOffset={1}>
              <FormGroup>
                <InputGroup>
                  <InputGroup.Addon>
                    Currency:
                  </InputGroup.Addon>
                  <FormControl componentClass="select"
                               value={ offerCurrency }
                               onChange={ event => this.setState({ offerCurrency: event.target.value })}
                  >
                    <option value="BALANCE">Bits</option>
                    <option value="VALOR">Valor</option>
                    <option value="SILVER">Silver</option>
                  </FormControl>
                </InputGroup>
              </FormGroup>
            </Col>
          </Col>

          <Col xs={20} xsOffset={2} style={{ padding: 0}}>
            <h5>For <span className="text-muted">(If I receive)</span>:</h5>
            <Col xs={12}>
              { askAmountError && <strong className="red-error">{ askAmountError }</strong>}
              <FormGroup className={ askAmountError ? 'has-error' : ''}>
                <InputGroup>
                  <InputGroup.Addon>
                    Amount:
                  </InputGroup.Addon>
                  <input type="text"
                         placeholder="1"
                         className="form-control"
                         value={ askAmount }
                         onChange={ event => this.onAskAmountChange(event) }
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs={11} xsOffset={1}>
              <FormGroup>
                <InputGroup>
                  <InputGroup.Addon>
                    Currency:
                  </InputGroup.Addon>
                  <FormControl componentClass="select"
                               value={ askCurrency }
                               onChange={ event => this.setState({ askCurrency: event.target.value })}
                  >
                    <option value="BALANCE">Bits</option>
                    <option value="VALOR">Valor</option>
                    <option value="SILVER">Silver</option>
                  </FormControl>
                </InputGroup>
              </FormGroup>
            </Col>
          </Col>

					{ error && <strong className="red-error">{error}</strong>}

          <Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <button className='btn btn-success btn-lg' type="submit" disabled={ this.state.submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
						</button>
          </Col>
        </Form>

        <Col xs={24} sm={20}>
          <p className="text-muted" style={{alignSelf: 'flex-start'}}>
						<span className="hl-word">Hint: </span> Read more about <Link to="/faq/how-to-trade">trades</Link>.</p>
        </Col>

      </div>
    );
  }
}

function createTradeWrapper(props) {
	if (!userInfo.uname) { return <NotLoggedIn/> }
	return <CreateTrade />
}

export default refresher(createTradeWrapper,
	[userInfo, 'UNAME_CHANGED']
);
