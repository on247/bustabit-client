import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class WhatIsTheBonus extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What is the bonus?</h3>
          <p>The bonus is a special prize that is awarded to the last people to cash out before the game busted. Getting the bonus is critical to skillful playing of bustabit, as it is the <span className="hl-word">only</span> way to overcome house odds.</p>

          <p>1% of each player's stake goes into the bonus pot. So if there are 4 players, betting 400, 300, 200, and 100, there will be 10 bits in the pot. If the biggest player wins, he gets the whole pot. The site works out the rate he would be getting if he won, ie. 400 bits bet gives 10 bits bonus - or 1/40th bonus per bit bet. It then applies the same rate to whoever actually wins.</p>

          <p>
            So if the 100 bit player wins, he gets 1/40th of 100, or 2.5 bits. That leaves 7.5 bits in the pot, which goes to the next best placing player(s).
          </p>

          <p>
            Suppose the 200 bit player comes 2nd. He is due 1/40th of 200, or 5 bits. There are still 7.5 bits in the pot, so he gets the full 5 bits he is due - the same as if he had come in 1st place.
          </p>

          <p>
            Suppose the 300 bit player comes 3rd. He's due 7.5 bits (300/40) but there are only 2.5 bits left in the pot, so he gets those and that's all. There's nothing left for the 4th or worse place players.
          </p>

          <p>
            1% of games will instant bust (0x) and no bonuses will be awarded, all other games have bonuses equal to 1% of the amount wagered.
          </p>

        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default WhatIsTheBonus;