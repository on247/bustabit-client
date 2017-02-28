import React, { PureComponent } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class MaxBet extends PureComponent {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What is the most I can bet?</h3>
          <p>We currently have a bet limit of 1,000,000 bits (1 BTC).</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default MaxBet;