import React, { Component } from 'react';
import userInfo from '../../core/userInfo'
import refresher from '../../refresher'

import Contents from './contents'

class Admin extends Component {

	render () {
		if (!userInfo.isTrusted()) {
			return <div>
				<h1><em>Super</em> secret stuff lies here.</h1>
				<p>
					Don't even try discover the hidden secrets, as it's protected by some of the most
					advanced client-side protection in the world.
				</p>
			</div>
		}

		return <Contents />
	}
}




export default refresher(Admin,
	[userInfo, 'UNAME_CHANGED']
);