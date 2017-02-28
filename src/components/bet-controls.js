import React, { PureComponent } from 'react';
import BetForm from './bet-form'
import Autobet from './autobet/autobet'
import { NavItem } from 'react-bootstrap'
import userInfo from '../core/userInfo'
import refresher from '../refresher';
import { Link } from 'react-router'
import browserSize from '../core/browser-size'

class BetControls extends PureComponent {

	constructor() {
		super();
		this.state = {
			tab: 'manual'
		}
	}

	handleSelect(selectedKey) {
		if (selectedKey === 1) {
			this.setState({tab: 'manual'})
		} else {
			this.setState({tab: 'auto'})
		}
		alert('selected ' + selectedKey);
	}

  render() {

		const {tab} = this.state;

		if (!userInfo.uname) {
			return (
				<div className="text-center" style={{margin: '15px'}}>
					<h4>
						<Link to="/login">Login</Link> or <Link to="/register">Register</Link> to start playing.
					</h4>
				</div>
			)
		} else {

			if (browserSize.isMobile()) {
				return (
					<BetForm />
				);
			} else {
				return (
					<div>
						<ul className="nav nav-tabs nav-justified bet-control-tabs">
							<li onClick={() => this.setState({tab: 'manual'})} className={ tab === 'manual' ? 'active' : ''}>
								<a>Manual</a></li>
							<NavItem eventKey={2} onClick={() => this.setState({tab: 'auto'})}
											 className={ tab === 'auto' ? 'active' : ''}>Auto</NavItem>
						</ul>
						<div>
							{ tab === 'manual' ? <BetForm /> : <Autobet /> }
						</div>
					</div>
				);
			}
		}
	}
}

export default refresher(BetControls,
	[userInfo, 'UNAME_CHANGED'],
	[browserSize, 'WIDTH_CHANGED']
);
