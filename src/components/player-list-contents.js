import React, { Component } from 'react';
import { formatBalance } from '../util/belt'
import engine from '../core/engine'
import { Link } from 'react-router'

class PlayerListContents extends Component {

	constructor(props) {
		super(props);

		this.rerender = this.forceUpdate.bind(this);
	}

	componentWillMount() {
		engine.on('PLAYERS_CHANGED', this.rerender);
	}

	componentWillUnmount() {
		engine.removeListener('PLAYERS_CHANGED', this.rerender);
	}

	activePlayers() {
		let playerList = [];

		for (const [uname, wager] of engine.playing) {
			playerList.push({ uname, wager });
		}

		playerList.sort((a, b) => {
			const wagerDiff = b.wager - a.wager;
			if (wagerDiff !== 0)
				return wagerDiff;

			return a.uname.localeCompare(b.uname);
		});

		const styleColor = engine.gameState === 'GAME_ENDED' ? '#ff5a5f' :  '#53DCCD'

		return playerList.map(x => <tr key={x.uname}
																	 style={{color: styleColor}}>
			<td><Link to={'/user/'+ x.uname} style={{color: styleColor}}>{x.uname}</Link></td>
			<td>-</td>
			<td>{ formatBalance(x.wager) }</td>
			<td>-</td>
		 </tr>);
	}

	cashedOutPlayers() {
		let ret = [];
		for (let i = engine.cashOuts.length - 1 ; i >= 0; --i) {
			const cashOut = engine.cashOuts[i];

			ret.push(<tr key={i} style={{ color: '#a9fd00'}}>
				<td><Link to={'/user/'+ cashOut.uname} style={{ color: '#a9fd00'}}>{cashOut.uname}</Link></td>
				<td>{cashOut.cashedAt}x</td>
				<td>{ formatBalance(cashOut.wager) }</td>
				<td>{ formatBalance(cashOut.wager * (cashOut.cashedAt - 1)) }</td>
			</tr>);
		}
		return ret;
	}


	render() {

		//engine.players.


		return (
			<tbody>
				{ this.activePlayers() }
				{ this.cashedOutPlayers() }
			</tbody>
		)
	}

}

export default PlayerListContents;