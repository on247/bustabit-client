import React, { PropTypes, PureComponent } from 'react'

import socket from '../../socket'

export default class OrderBookResults extends PureComponent {
	constructor(props) {
		super(props);
		this._unmounted = false;
		this.state = {
			hit: false
		}
	}


	hitTrade(tradeId) {
		this.setState({ hit: true});

		socket.send('hitTrade', tradeId)
	}

	render() {
		const { tradeId, isSelf } = this.props;
		const { hit } = this.state;

		return <button className="btn btn-success"
		        onClick={ () => this.hitTrade(tradeId) }
		        disabled={ hit || isSelf }
		       >Hit!</button>
	}

	componentWillUnmount() {
		this._unmounted = true;
	}



}

OrderBookResults.propTypes = {
	tradeId: PropTypes.number.isRequired,
	isSelf: PropTypes.bool.isRequired,
};
