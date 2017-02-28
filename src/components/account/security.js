import React, { PureComponent, PropTypes } from 'react'
import {  Col, Row } from 'react-bootstrap'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';



class AccountSecurity extends PureComponent {



  render() {
    let { body } = this.props;


    return (
      <div className="content">
        <Row className="account-header">
          <Col sm={12} xs={24}>
            <h3>{userInfo.uname}</h3>
          </Col>
          <Col sm={12} xs={24} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '10px'}}>
            <p>
              <span className={ userInfo.email ? 'green-color' : 'red-color'}>
                <i className={userInfo.email ? 'fa fa-check-circle' : 'fa fa-times-circle'}></i>
              </span>
              <span className="key-muted"> Recovery E-mail </span>
            </p>
            <p>
              <span className={ userInfo.hasMFA ? 'green-color' : 'red-color'}>
                <i className={userInfo.hasMFA ? 'fa fa-check-circle' : 'fa fa-times-circle'}></i>
              </span>
              <span className="key-muted"> Two-Factor Authentication </span>
            </p>
            <p>
              <span className={ userInfo.emergencyWithdrawalAddress ? 'green-color' : 'red-color'}>
                <i className={userInfo.emergencyWithdrawalAddress ? 'fa fa-check-circle' : 'fa fa-times-circle'}></i>
              </span>
              <span className="key-muted"> Emergency Address </span>
            </p>
          </Col>
        </Row>
        <Row>
          { body }
        </Row>
      </div>
    )
  }
}

AccountSecurity.propTypes = {
	body: PropTypes.node.isRequired
};

export default refresher(AccountSecurity,
	[userInfo, 'UNAME_CHANGED' ]
);
