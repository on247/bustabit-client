import React, { Component, PropTypes } from 'react';
import engine from '../core/engine'
import refresher from '../refresher'

// This button acts as *both* a bet button and as

// Takes an optional an props:
//   disabled:   boolean  (optional)
//   onBet       function (mandatory)


class BetButton extends Component {
  constructor(props) {
    super(props);

		this.state = { animation: false };
  }


	onClick() {
		this.setState({animation: true});

		if (engine.gameState === 'GAME_IN_PROGRESS' && engine.currentlyPlaying()) {
			engine.sendCashOut();
		} else if (engine.isBetQueued()) {
			engine.cancelQueuedBet();
		} else {
			this.props.onBet();
		}
	}


  render () {

		let disabled = this.props.disabled || engine.placingBet || engine.isEnteringGame();
		let lookDisabled = engine.isBetQueued();


		let text;
		let kind = 'btn-bet icon-bet';


		if (engine.gameState === 'GAME_IN_PROGRESS' && engine.currentlyPlaying()) {
			text = 'CASH OUT';
			kind = 'btn-cash-out icon-cash-out';
		} else if (engine.isBetQueued()) {
			text = <span>BETTING <span style={{ color: '#ff5a5f', textTransform: 'capitalize', fontSize: 'small', letterSpacing: '0px'}}>(Cancel)</span></span>;
			kind = 'btn-bet';
		} else if (engine.placingBet) {
			text = 'PLACING BET';
		} else if (engine.isEnteringGame()) {
			text = 'BETTING';
		}	else {
			text = 'BET';
		}



		const style = disabled || lookDisabled ? { opacity: 0.5 } : {};


    return (
      <button
				style={style}
        onClick={() => this.onClick()}
        onAnimationEnd={() => this.setState({animation: false})}
        className={this.state.animation ? 'btn-custom btn-activated-a '+ kind : 'btn-custom '+ kind }
				disabled={disabled}
        >
				{ text }
      </button>
    );
  }
}

BetButton.propTypes = {
	disabled: PropTypes.bool.isRequired,
	onBet: PropTypes.func.isRequired
};

export default refresher(BetButton,
   [engine, 'GAME_STATE_CHANGED'],
	 [engine, 'BET_STATUS_CHANGED']
)