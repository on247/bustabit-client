import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class DepositAddressValid extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>For how long is the deposit address valid?</h3>
          <p>It is <span className="hl-word">permanently</span> attached to your account. You can save it, or use it for automatic funding, or whatever else you like. All payments to this address will be automatically credited to your account.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default DepositAddressValid;