import React, { PureComponent } from 'react';
import userInfo from '../../core/userInfo'
import browserSize from '../../core/browser-size'
import refresher from '../../refresher';
import TopBarMobile from './top-bar-mobile';
import TopBarDesktop from './top-bar-desktop'

class TopBar extends PureComponent {


	render() {


    let navBar;

    if (browserSize.isMobile()) {
      navBar = <TopBarMobile />
    } else {
      navBar = <TopBarDesktop />

    }

    return navBar;
  }
}

export default refresher(TopBar,
	[userInfo, 'UNAME_CHANGED', 'BALANCE_CHANGED'],
  [browserSize, 'WIDTH_CHANGED']
);

