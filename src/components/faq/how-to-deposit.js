import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class HowToDeposit extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How do I deposit bits?</h3>
          <p>You will need to transfer bitcoins to the deposit address on your account page. If you do not have any bitcoins, we can recommend <a href="https://www.coinbase.com/" target="_blank">Coinbase</a> if you are in the US (although the registration process is lengthy). Another great option is <a href="https://localbitcoins.com/" target="_blank">LocalBitcoins.com</a>, which lists traders in your area willing to sell (or buy) bitcoins. You can also search online to see if there are any bitcoin ATMs near you. And remember, you can withdraw directly to the bitcoin address on your account page!</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default HowToDeposit;