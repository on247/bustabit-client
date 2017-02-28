import React, { PureComponent, PropTypes } from 'react'
import UserChart from './user-chart'
import { Row, Col } from 'react-bootstrap'
import refresher from '../refresher';
import socket from '../socket';
import TimeAgo from 'timeago-react';
import LoadingAnimation from './loading-animation'
import { formatBalance } from '../util/belt'

import userInfo from '../core/userInfo'


class UserPage extends PureComponent {
	constructor(props) {
		super(props);
		this.unmounted = false;
		this.state = {
			uname: this.props.params.uname || userInfo.uname,
			bets: 0,
			created: new Date(),
			loading: true,
			profit: 0,
			profitATH: 0,
			profitATL: 0,
			stake: 0,
			wagered: 0,
			unameError: null
		};
	}

	componentWillMount() {
		socket.send('getUserInfo', this.state.uname)
			.then(info => {
				if (this.unmounted) return;
				info.created = new Date(info.created);
				info.loading = false;
				this.setState(info)
			}, err => {
				if (this.unmounted) return;
				if (err === 'NO_SUCH_UNAME') {
					this.setState({
						unameError: 'This username doesn\'t exist.'
					})
				}
				else {
					console.error(err);
				}
			});
	}

	componentWillUnmount(){
		this.unmounted = true;
	}


	render() {
		const {uname, bets, loading, created, profit, profitATH, profitATL, wagered, unameError} = this.state;

		if(unameError) {
			return <h4>The username doesn't exist.</h4>
		}

		if (loading) {
			return <LoadingAnimation />
		} else {
			return (
				<div className="content">
					<Row className="account-header">
						<Col sm={12} xs={24}>
							<h3>{uname}</h3>
						</Col>
						<Col sm={12} xs={24} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
							<p><span className="key-muted">Joined: </span>
								<span className="bold" style={{marginRight: '5px'}}>{new Date(created).toDateString()}</span>
								<small>[<TimeAgo
								datetime={created}
								locale='en'/>]</small>
							</p>
						</Col>
					</Row>

					<Row>
						<Row>
							<Col sm={24} xs={24} style={{marginTop: '20px'}}>
								<h5 style={{textTransform: 'uppercase', letterSpacing: '3px'}}>Performance</h5>
							</Col>
						</Row>
						<Row>
							<Col sm={12} xs={24}>
								<Col xs={16}><span className="key-muted">Games Played: </span></Col>
								<Col xs={8}><span className="bold">{bets}</span></Col>
							</Col>
							<Col sm={12} xs={24}>
								<Col xs={16}><span className="key-muted">Total Wagered: </span></Col>
								<Col xs={8}><span className="bold">{formatBalance(wagered)} bits</span></Col>
							</Col>
						</Row>
						<Row>
							<hr />
							<Col sm={12} xs={24}>
								<Col xs={16}><span className="key-muted">Net Profit: </span></Col>
								<Col xs={8}><span className="bold">{formatBalance(profit)} bits</span></Col>
							</Col>
						</Row>
						<Row>
							<Col sm={12} xs={24}>
								<Col xs={16}><span className="key-muted">Profit All Time High: </span></Col>
								<Col xs={8}><span className="bold">{formatBalance(profitATH)} bits</span></Col>
							</Col>
							<Col sm={12} xs={24}>
								<Col xs={16}><span className="key-muted">Profit All Time Low: </span></Col>
								<Col xs={8}><span className="bold">{formatBalance(profitATL)} bits</span></Col>
							</Col>
						</Row>
					</Row>
					<Row>
						<Col xs={24} style={{marginTop: '25px'}}>
							<UserChart uname={uname} numberOfBets={bets} totalProfit={profit}/>
						</Col>
					</Row>
				</div>
			)
		}
	}
}

UserPage.propTypes = {
	params: PropTypes.object // From react router - params.uname
};

export default refresher(UserPage,
	[userInfo, 'BALANCE_CHANGED']
);
