import React, { PureComponent } from 'react';
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { formatBalance } from '../util/belt'
import socket from '../socket';
import TimeAgo from 'timeago-react';
import LoadingAnimation from './loading-animation'


class BetInformation extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			uname: '',
			cashedAt: 0,
			payout: 0,
			wager: 0,
			created: new Date(),
			id: 0,
			loading: true,
			gameId: 0,
			bust: 0
		};
	}

	componentWillMount() {
		socket.send('getBetInfo', Number.parseInt(this.props.params.betId,10))
			.then(betInfo => {
				betInfo.created = new Date(betInfo.created);
				betInfo.loading = false;
				this.setState(betInfo)
				console.log('bet info is :',betInfo);
			});
	}


	render() {
		const {uname, loading, bust, created, id, cashedAt, gameId, wager } = this.state;

		if (loading) {
			return <LoadingAnimation/>
		}

		else {
			return (
				<Row>
					<Col sm={20} smOffset={2} xs={24} style={{marginTop: '20px'}}>
						<h4 style={{textTransform: 'uppercase', letterSpacing: '3px'}}> ID #{id}</h4>
						<hr />
						<h5><span className="key-muted">Player: </span><span className="bold"> <Link to={'/user/'+uname}> {uname}</Link></span></h5>
						<h5><span className="key-muted">Game: </span><span className="bold"> <Link to={'/game/'+gameId}>{gameId}</Link></span></h5>
						<h5><span className="key-muted">Bet: </span><span className="bold"> {formatBalance(wager)} bits</span></h5>
						<h5><span className="key-muted">Busted at: </span><span className="bold"> {bust}</span></h5>
						<h5><span className="key-muted">Cashed out: </span><span className={ cashedAt > 0 ? 'bold green-color' : 'bold red-color'}> { cashedAt ? cashedAt+'x' : '-' }</span></h5>
						<h5><span className="key-muted">Profit: </span>
							<span className={ cashedAt > 0 ? 'bold green-color' : 'bold red-color'}> { formatBalance(wager * (cashedAt - 1)) } bits</span>
						</h5>
						<h5><span className="key-muted">Date: </span>
							<span className="bold" style={{marginRight: '5px'}}> {created.toUTCString()}</span>
							<span><small><TimeAgo
								datetime={created}
								locale='en' /></small>
					</span>
						</h5>
					</Col>
				</Row>
			)
		}
	}
}



export default BetInformation;
