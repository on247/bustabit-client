import React, { PureComponent, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';


class AccountSettings extends PureComponent {

  render() {
		let { body } = this.props;
    return (
      <div className="content">
        <Row className="account-header">
          <Col sm={12} xs={24}>
            <h3>{userInfo.uname}</h3>
          </Col>
          <Col sm={12} xs={24} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          </Col>
        </Row>
        <Row>
					{ body }
        </Row>
      </div>
    )
  }
}

AccountSettings.propTypes = {
	body: PropTypes.node.isRequired
};


export default refresher(AccountSettings,
	[userInfo, 'BALANCE_CHANGED', 'UNAME_CHANGED']
);
