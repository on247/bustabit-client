import React, { PureComponent } from 'react'
import {  Col } from 'react-bootstrap'
import { Link } from 'react-router'
import FaqFooter from './footer'

class WhatIsBustabit extends PureComponent {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What is Bustabit?</h3>
          <p>Bustabit is a thrilling bitcoin gambling social game. It's a real time, simple and exciting game where you can securely play for fun or to win a fortune. </p>
          <p>The game is all about placing a bet, while a lucky curve starts rising. As the curve rises, your bet gets multiplied by an increasing number. If you cash out in time, you'll make all these bits. But beware, if you don't cash out before the curve busts, you'll lose!</p>
          <p>Bustabit is also <Link to="/faq/is-the-game-fair">provably fair</Link> and has one of the lowest house edges in the market, of only 1%.</p>
          <p>Bustabit has a growing, solid community. In here you can be a player but also become an bankroller and make a profit along with the site!</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default WhatIsBustabit;