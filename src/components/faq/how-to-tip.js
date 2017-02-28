import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import { Link } from 'react-router'
import FaqFooter from './footer'

class HowToTip extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How can I tip someone?</h3>
          <p>Sending free bits to other players is possible through the tip system in Bustabit. It is completely up to you if you decide to tip someone for whatever reason.</p>
          <p>In order to send a tip, you just need to go to the <Link to="/tip">tip section</Link> and fill in the form with the amount, currency and username to receive the tip. Notice tips are definitive and no way reversible. Make sure you type the amount and username correctly!</p>
          <p><span className="hl-word">Remember:</span> To keep the quality of the chat experience for all players, it is not allowed to request tips or free bits in the main channels. If you do so, you will likely get muted or banned.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default HowToTip;