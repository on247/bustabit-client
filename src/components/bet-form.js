import React, {  Component } from 'react';
import { Form, FormGroup, Col, InputGroup } from 'react-bootstrap'
import { formatBalance } from '../util/belt'

import BetButton from './bet-button'

import engine from '../core/engine'



const  textMuted = { color: '#999' };

class BetForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			wager: '1',
			payout: '2',
		};
	}


	bet() {
		let { wager, payout } = this.state;

		wager = Number.parseInt(wager,10) * 100;
		payout = Number.parseFloat(payout);

		engine.bet(wager, payout);
	}

  render() {

		const errors = validate(this.state);

    return (

				<Col xs={24}>
					<Form horizontal onSubmit={ (event) => event.preventDefault() }>
					<Col xs={24}>
						{ errors['_error'] && <strong>{errors['_error']}</strong>}
					</Col>
					<Col md={24} sm={18} xs={17}>
						{ this.wagerFormGroup(errors) }
						{ this.payoutFormGroup(errors) }
					</Col>
          <Col md={24} sm={6} xs={7} style={{ display: 'flex', justifyContent: 'center', paddingRight: '0px'}}>
            <BetButton
              onBet={ () => this.bet() }
              disabled={ Object.keys(errors).length !== 0 }
            />
          </Col>
					<Col xs={12} style={{ display: 'flex', justifyContent: 'center'}}>
						<div>
							<span style={textMuted}>Profit: </span> { this.potentialProfit(errors) }
						</div>
					</Col>
					<Col xs={12} style={{ display: 'flex', justifyContent: 'center'}}>
						<div>
							<span style={textMuted}>Win Chance: </span> { this.winChance(errors) }%
						</div>
					</Col>
					</Form>
				</Col>

    )
  }

	wagerFormGroup(errors) {
		return (<FormGroup  className={ errors['wager'] ? 'has-error' : ''}>
			<InputGroup>
				<InputGroup.Addon>
					Bet:
				</InputGroup.Addon>
				<input type="text" name="wager" className="form-control"
							 value={this.state.wager}
							 onChange={ event => this.setState({ wager: event.target.value })}
				/>
				<InputGroup.Addon>
					bits
				</InputGroup.Addon>
			</InputGroup>
		</FormGroup>)
	}


	payoutFormGroup(errors) {
		return (
			<FormGroup className={ errors['payout'] ? 'has-error' : ''}>
				<InputGroup>
					<InputGroup.Addon>
						Payout
					</InputGroup.Addon>
					<input type="number" name="payout" className="form-control"
								 value={this.state.payout}
								 onChange={ event => this.setState({ payout: event.target.value })}
					/>
					<InputGroup.Addon>
						x
					</InputGroup.Addon>
				</InputGroup>
			</FormGroup>
		)
	}


	winChance(errors) {
		if (errors['payout']) {
			return '???';
		}

		const payout = Number.parseFloat(this.state.payout);

		const winChancePercent = (99 / payout).toFixed(2);

		return winChancePercent;
	}

	potentialProfit(errors) {
		if (Object.keys(errors).length !== 0) {
			return '???';
		}

		// The wager is in bits (since it's from the UI)
		// ...but instead of immediately converting it to satoshis (as we should)
		// we're going leave it as a hundredth of what it should be, and instead
		// multiply payout by 100 so that it's a clean integer and has no rounding issues

		const wager = Number.parseFloat(this.state.wager);
		const payout = Math.round(Number.parseFloat(this.state.payout) * 100);

		const potentialProfit = wager * (payout - 100);

		const unit = Math.floor(potentialProfit) === 100 ? ' bit' : ' bits';

		return formatBalance(potentialProfit) + unit;
	}
}





function validateWager(wager) {
  if (!wager)
    return 'must enter a bet amount';

  const isNumberRegex = /^[1-9]\d*$/; // handle against leading zeros

  if (!isNumberRegex.test(wager))
    return 'bet is not a valid integer'

}


function validatePayout(payout) {
	if (!payout)
		return 'No payout';

	// TODO: handle , as decimal seperator

	const isNumberRegex = /^[1-9][0-9]*\.?\d{0,2}$/; // handle against leading zeros

	if (!isNumberRegex.test(payout))
		return 'payout is not a valid multiplier';

	payout = Number.parseFloat(payout);

	if (payout < 1.01)
		return 'Payout must be at least 1.01';

	if (payout > 1e6)
		return 'Payout must be less than 1,000,000';
}


function validate(values) {
  const errors = {};

  const vp = validatePayout(values.payout);

  if (vp) {
    errors['payout'] = vp;
    errors['_error'] = vp;
  }

  const vw = validateWager(values.wager);

  if (vw) {
    errors['wager'] = vw;
    errors['_error'] = vw;
  }

  return errors;

}

export default BetForm;