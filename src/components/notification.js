import React, { Component } from 'react';
import { Notification as ReactNotification } from 'react-notification';
import notification from '../core/notification';

import refresher from '../refresher'

class Notification extends Component {

  render() {

    return (
			/* eslint-disable */
        <ReactNotification
          isActive={notification.isActive()}
          message={notification.getMessage()}
          action={<i className="fa fa-times"></i>}
          style={false}
          className={ notification.type === 'error' ? 'notification-bar-error' : 'notification-bar'}
          activeClassName="active animated bounceIn"
          dismissAfter={4000}
          onDismiss={() =>  notification.clearMessage()}
          onClick={() =>  notification.clearMessage()}
        />
    );
  }
}


export default refresher(Notification,
	[notification, 'CHANGE']
);
