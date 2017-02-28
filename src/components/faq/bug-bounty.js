import React, { PureComponent } from 'react'
import {  Col } from 'react-bootstrap'
import { Link } from 'react-router'
import FaqFooter from './footer'

class BugBounty extends PureComponent {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>Do you have a bug bounty program?</h3>
          <p>If you find a bug in the website, please contact us and if the bug is worth fixing we will offer you a payment regarding the severity of the bug. You can contact us <Link to="/support">here</Link>. All payments are made in bitcoin.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default BugBounty;