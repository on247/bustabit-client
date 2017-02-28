import React, { PureComponent } from 'react'
import userInfo from '../../core/userInfo';
import refresher from '../../refresher';
import SetTwoFactorAuthentication from './security-2fa-set'
import RemoveTwoFactorAuthentication from './security-2fa-remove'


class TwoFactorAuthentication extends PureComponent {

  render() {

    if (!userInfo.hasMFA) {
      return <SetTwoFactorAuthentication/>
    } else {
      return <RemoveTwoFactorAuthentication/>
    }
  }
}

export default refresher(TwoFactorAuthentication,
	[userInfo, 'UNAME_CHANGED']
);
