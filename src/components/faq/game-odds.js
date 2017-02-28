import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import { Link } from 'react-router'
import FaqFooter from './footer'

class GameOdds extends Component {

  //TODO: Link to odds calculator

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What are the game odds?</h3>
          <p>The house margin is scaled between 0 and 1 %, depending on how long you hold. An additional 1 % is effectively taken from every bet and put into the <Link to="/faq/what-is-the-bonus">bonus pool</Link>, which is distributed in its entirety every game. As a consequence, skilless or random play has—at worst—an expected return of -2 %, but it is possible to overcome the house margin by skillfully getting bonuses.</p>
          <p>The numbers are baked into the game, so you never need to worry about it. We do not have a fixed house margin, as this would prevent highly conservative play (e.g. If you were only attempting to make $2 in a $100 game, a house margin of 1 % would be 50 % of your potential profits!). Our unique formula makes it fair for both highly conservative play (cash out early) and highly aggressive play (hold until you're a millionaire). All games are <Link to="/faq/is-the-game-fair">provably fair</Link>.</p>
          <p>
            The exact formula for the houses expected return is:
          </p>
          <pre>1 % * (intendedCashOut - roomAmount) * (roomAmount / intendedCashOut)</pre>
          <p>But to really get a good sense of how this affects you, please use our handy <Link to="#">odds calculator</Link>.</p>
          <p>
            The other important thing to keep in mind is that every game has a 1 % chance of instantly busting. We do not make <span className="hl-word"> any</span> money on it, but rather use this to fund the bonus scheme. This is an important consideration to make if you are playing in such a way that you never win the bonus.
          </p>
          <img src={ require('../../../img/house-edge.png') } alt="Bustabit House Edge" className="img-responsive"/>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default GameOdds;