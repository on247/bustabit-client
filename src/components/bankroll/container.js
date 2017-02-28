import React, { PureComponent, PropTypes } from 'react'
import Tab from '../tab';
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';
import NotLoggedIn from '../not-logged-in-well'

class Bankroll extends PureComponent {

  render() {

		let {body} = this.props;
		if (!userInfo.uname) {
			return (
				<NotLoggedIn />
			)
		}
		return (
			<div style={{minHeight: '40vh', marginBottom: '20px'}}>
				<ul className="nav nav-tabs nav-justified">
					<Tab to="/bankroll/overview"><span>Overview</span></Tab>
					<Tab to="/bankroll/add-to-bankroll"><span>Add</span></Tab>
					<Tab to="/bankroll/remove-from-bankroll"><span>Remove</span></Tab>
					<Tab to="/bankroll/history"><span>History</span></Tab>
				</ul>
				{ body }
			</div>
		)
	}
}

Bankroll.propTypes = {
	body: PropTypes.node.isRequired
};

export default refresher(Bankroll,
	[userInfo, 'UNAME_CHANGED']
);
