import React, { PureComponent } from 'react';
import { Table, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { formatBalance } from '../util/belt'
import socket from '../socket';
import TimeAgo from 'timeago-react';
import LoadingAnimation from './loading-animation'


class GameInformation extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			bets: [],
			bust: 0,
			forced: false,
			created: new Date(),
			id: 0,
			loading: true
		};
	}

	componentWillMount() {
		socket.send('getGameInfo', Number.parseInt(this.props.params.gameId,10))
					.then(gameInfo => {
						gameInfo.created = new Date(gameInfo.created);
						gameInfo.loading = false;
						this.setState(gameInfo)
						//console.log('game info is :',gameInfo);

					});
	}

	getBets() {
		const { bets } = this.state;
		return (
			<tbody>
			{
				bets.map(item => <tr key={item.id}>
					<td><Link to={"/user/" + item.uname}>{item.uname}x</Link></td>
					<td>{ formatBalance(item.wager) }</td>
					<td>{ item.cashedAt ? item.cashedAt+'x' : '-' }</td>
					<td>{ formatBalance(item.wager * (item.cashedAt - 1)) }</td>
					<td><Link to={'/bet/'+item.id}><button><i className="fa fa-link" aria-hidden="true"></i></button></Link></td>
				</tr>
			)}
			</tbody>
		);
	}

	render() {
		const {loading, bust, forced, created, id, hash} = this.state;

		if (loading) {
			return <LoadingAnimation/>
		}

		else {
			return (
				<Row>
					<Col sm={18} xs={12} style={{marginTop: '20px'}}>
						<h4 style={{textTransform: 'uppercase', letterSpacing: '3px'}}> ID #{id}</h4>
						<hr />
						<h5><span className="key-muted">Busted at: </span><span className="bold"> {bust}x</span></h5>
						<h5><span className="key-muted">Date: </span>
							<span className="bold" style={{marginRight: '5px'}}> {created.toUTCString()}</span>
						<span><small><TimeAgo
						datetime={created}
						locale='en' /></small>
					</span>
						</h5>
						<h5><span className="bold red-error"> { forced ? 'Forced' : ''}</span></h5>
					</Col>
					<Col xs={24} style={{marginTop: '10px'}}>
						<h4>Players</h4>

						<Table striped bordered hover responsive condensed className="history-table">
							<thead className="table-header">
							<tr>
								<th>Player</th>
								<th>Bet</th>
								<th>Cashed Out</th>
								<th>Profit</th>
								<th className="text-center"><i className="fa fa-link" aria-hidden="true"></i></th>
							</tr>
							</thead>
							{this.getBets()}
							</Table>

						<span className="key-muted">Hash:</span>
						<span><small><Link to="/faq/is-the-game-fair">Is the game fair?</Link></small></span>
						<pre>{hash}</pre>
					</Col>
				</Row>
			)
		}
	}
}



export default GameInformation;
