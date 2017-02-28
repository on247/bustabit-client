import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class HowToPlay extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How to play?</h3>
          <p>First you need to have a positive balance, by depositing bitcoin to your account, collecting the faucet, or receiving a tip from someone in the community.</p>
          <p>Next, select the amount to bet and a cash out multiplier. Place your bet. Watch the multiplier increase from 1x upwards! You can cash out before your set up cash out limit, pressing the 'Cash Out' button. Get your bet multiplied by that multiplier. But be careful because the game can bust at any time, and you'll get nothing!</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default HowToPlay;