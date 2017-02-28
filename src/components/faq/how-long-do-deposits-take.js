import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class HowLongDoDepositsTake extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How long do deposits take to be credited?</h3>
          <p>We instantly credit accounts upon a single confirmation, which on average is approximately 10 minutes from the time of the transaction.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default HowLongDoDepositsTake;