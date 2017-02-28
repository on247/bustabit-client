import React, { PureComponent, PropTypes } from 'react'
import Tab from '../tab';
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';
import NotLoggedIn from '../not-logged-in-well'

class Transactions extends PureComponent {

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
					<Tab to="/transactions/deposits"><span>Deposits</span></Tab>
					<Tab to="/transactions/withdrawals"><span>Withdrawals</span></Tab>
					<Tab to="/transactions/tips"><span>Tips</span></Tab>
				</ul>
				{ body }
			</div>
		)
	}
}

Transactions.propTypes = {
	body: PropTypes.node.isRequired
};

export default refresher(Transactions,
	[userInfo, 'UNAME_CHANGED']
);
