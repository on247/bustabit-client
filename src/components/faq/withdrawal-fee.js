import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'
import { withdrawalFee, formatBalance } from '../../util/belt'

class WithdrawalFee extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What's the withdrawal fee?</h3>
          <p>Everytime you withdraw, you will be requested to pay a 300 bits withdrawal fee.</p>
          <p>We use those {formatBalance(withdrawalFee)} bits to pay the mining fee. As required, we will as well chip in with our money to help expedite confirmation time.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default WithdrawalFee;
