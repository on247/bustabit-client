import React, { PureComponent, PropTypes } from 'react'
import Tab from '../tab';
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';
import NotLoggedIn from '../not-logged-in-well'


class Account extends PureComponent {

  render() {

    let { body } = this.props;

		if (!userInfo.uname) {
			return (
        <NotLoggedIn />
			)
		}
	return (
		<div>
			<ul className="nav nav-tabs nav-justified">
				<Tab to="/account/overview"><span>Overview</span></Tab>
				<Tab to="/account/stats"><span>Stats</span></Tab>
				<Tab to="/account/security"><span>Security</span></Tab>
				<Tab to="/account/settings"><span>Settings</span></Tab>
			</ul>
			{ body }
		</div>
	)}
}

Account.propTypes = {
	body: PropTypes.node.isRequired
};

export default refresher(Account,
	[userInfo, 'UNAME_CHANGED']
);
