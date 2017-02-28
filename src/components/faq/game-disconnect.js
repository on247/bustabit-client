import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class GameDisconnect extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What happens if I disconnect from the game?</h3>
          <p>Upon detecting that you have disconnected we cash you out (assuming the game is still in progress). Regardless of whether your client is connected or not, the <span className="hl-word"> auto cash-out</span> feature will work as expected (it happens on the server), and we highly recommend you use it if internet reliability or performance is a concern.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default GameDisconnect;