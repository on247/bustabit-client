import React, { PureComponent, PropTypes } from 'react'
import Tab from '../tab';
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';
import NotLoggedIn from '../not-logged-in-well'

class TradeCenterContainer extends PureComponent {

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
							<Tab to="/trade/order-book"><span>Order Book</span></Tab>
							<Tab to="/trade/my-trades"><span>My Trades</span></Tab>
							<Tab to="/trade/create-trade"><span>Create Trade</span></Tab>
					</ul>
				{ body }
			</div>
		)
	}
}

TradeCenterContainer.propTypes = {
	body: PropTypes.node.isRequired
};

export default refresher(TradeCenterContainer,
	[userInfo, 'UNAME_CHANGED']
);
