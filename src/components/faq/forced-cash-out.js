import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class ForcedCashOut extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What happens when the server forces people to cash out?</h3>
          <p>Under some circumstances the server will force people to cash out. The most common reason is that the game multiplier has gotten so large that we are risking too much of our bankroll (10 % or more). Another possible reason is unexpected server problems. If more than one person in a game is affected by the forced cash-out, we allocate the last cash-out bonus to a random player.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default ForcedCashOut;