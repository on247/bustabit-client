import React, { PureComponent } from 'react';
import userInfo from '../core/userInfo'
import refresher from '../refresher';
import { formatBalance } from '../util/belt';

class Balance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    	amount: 0
    };
	}

  render() {

    return (
			<span key={userInfo.balance} style={{ display: 'block'}}>
				Bits: { formatBalance(userInfo.balance) }
			</span>
    )
  }

}

export default refresher(Balance,
  [userInfo, 'UNAME_CHANGED', 'BALANCE_CHANGED']
);


