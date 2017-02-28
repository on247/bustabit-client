import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class HowToWithdraw extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How do I withdraw bits?</h3>
          <p>On your account page, you can transfer bits to any bitcoin address you want. Small withdrawals (i.e. smaller than the balance of our hot-wallet) are processed instantly and you will be given the transaction ID immediately.</p>
          <p>Larger withdrawals will be shown in your withdrawal page as "PENDING" and will require us to manually remove sufficient funds from our cold storage. Usually this process will take less than two hours, but may take up to 24 hours, depending on the time of day and other circumstances.</p>
          <p>We remove 100 bits (about 0.05 USD) from any withdrawal amount to cover mining fees. We charge this amount <span className="hl-word">regardless</span> of the actual mining fees attached to the transaction, which may be more or less than this, depending on the block competition at the time of your withdrawal.</p>
          <p>Withdrawals must be in increments of 1 bit (100 satoshis), with a minimum withdrawal of 200 bits (of which 100 bits goes towards the mining fee). As required, we will chip in our own money to help expedite confirmation time, such that we typically pay 200 bits in mining fees, despite charging you only 100 bits.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default HowToWithdraw;