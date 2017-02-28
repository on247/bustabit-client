import React, { Component } from 'react'
import {  Col, Row } from 'react-bootstrap'
import { Link } from 'react-router';
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';

class AccountSecurityMenu extends Component {



  render() {

    return (
      <Row>
        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Choose an option:</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/account/security/update-password">Update Password</Link>
            </li>
            <li role="presentation">
              <Link to="/account/security/update-email">Update Email</Link>
            </li>
            <li role="presentation">
              <Link to="/account/security/2fa">Two Factor Authentication</Link>
            </li>
            <li role="presentation">
              <Link to="/account/security/emergency-address">Emergency Address</Link>
            </li>
          </ul>
        </Col>
      </Row>
    )
  }
}


export default refresher(AccountSecurityMenu,
	[userInfo,  'UNAME_CHANGED']
);