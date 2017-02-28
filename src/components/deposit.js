import React, { PureComponent } from 'react'
import QRCode from 'qrcode.react'
import { Col, FormGroup, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router'
import userInfo from '../core/userInfo'
import refresher from '../refresher';
import NotLoggedIn from './not-logged-in-well'
import socket from '../socket'
import LoadingAnimation from './loading-animation'

class Deposit extends PureComponent {
	constructor(props) {
		super(props);
		this.bitcoinAddress = null; // this a ref
		this.state = {};
	}

	componentWillMount() {
		socket.send('getDepositAddress').then(address => {
			if (this._unmounted) return;

			this.setState({address});
		}).catch(error => {
			console.error('Got error: ', error, ' when trying to get deposit address');

			if (this._unmounted) return;

			this.setState({error});
		});
	}

	componentWillUnmount() {
		this._unmounted = true;
	}

	copyAddress() {
		this.bitcoinAddress.select();

		try {
			let successful = document.execCommand('copy');
			let msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copying text command was ' + msg);
		} catch (err) {
			console.error('Error. Unable to copy', err);
		}
	}

	render() {



		if (this.state.error) {
			return <div>Could not get deposit address, got error: {this.state.error} </div>
		} else if (this.state.address) {
			return (
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px'}}>
					<Col xs={24} sm={20}>
						<FormGroup>
							<InputGroup className="responsive-input-group">
								<InputGroup.Addon>
									Bitcoin Deposit Address:
								</InputGroup.Addon>
								<input type="text"
											 className="form-control"
											 value={this.state.address}
											 ref={(input) => { this.bitcoinAddress = input } }
											 readOnly/>
								<InputGroup.Button>
									<button className="btn btn-info form-control"
													type="button"
													onClick={() => this.copyAddress() }
									>
										<i className="fa fa-clipboard"></i> Copy
									</button>
								</InputGroup.Button>
							</InputGroup>
						</FormGroup>
					</Col>
					<h5>QR Code</h5>
					<QRCode value={this.state.address}/>
					<br />
					<Col xs={24} sm={20}>
						<p style={{alignSelf: 'flex-start'}}><span className="hl-word">Tip: </span> There is no minimum or maximum deposit amount
							but you will need to wait until <em>1 confirmation</em> for it to appear in your balance.
							.</p>
						<p className="text-muted" style={{alignSelf: 'flex-start'}}><span className="hl-word">Hint: </span>If you
							don't know how to deposit, check the procedure <Link to="/faq/how-to-deposit">here</Link>.</p>
					</Col>
					<Col sm={6} xs={12} style={{marginTop: '20px'}}>
						<Link className="btn btn-info" to="/transactions/deposits"><i className="fa fa-history"></i> History</Link>
					</Col>
				</div>);
		} else {
			return <LoadingAnimation/>
		}
	}
}

function DepositWrapper() {
	if (!userInfo.isLoggedIn())
		return <NotLoggedIn/>;

	return <Deposit/>;
}

export default refresher(DepositWrapper,
	[userInfo, 'UNAME_CHANGED']
);



