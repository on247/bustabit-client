import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class GameLimit extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How high can the game go?</h3>
          <p>There's no real limit! However, if during a game we ever are facing a net loss of 3% of the bankroll or greater, the server will automatically cash out all players still in the game, forcing them to enjoy an early win and a sizeable profit. You can see in game what the current max win is (in the bottom right of the chart).</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default GameLimit;