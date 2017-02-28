import React, { PureComponent } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class GameBustCalc extends PureComponent {

  //TODO: Update code link

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How is the game bust calculated?</h3>
          <p>The code that decides the multiplier for each round is <a href="#" target="_blank">here</a>.</p>
          <p>It basically does three things.</p>
          <p>First, it mixes the hash with the clientSeed (decided by the provably fair seeding event) using hmac-sha256.</p>
          <p>
            Secondly it gives a 1 in 101 chance of instant busting.
          </p>
          <p>Third, it works out what the multiplier would be if there was no house edge.</p>
          <p>Fourth, it takes 1% off the multiplier and adds on 0.01x:</p>
          <p>So half the time (other than 0x bust which we can ignore because they pay for themselves with the bonus) the multiplier will be 1.99x or more.</p>
          <p>That means if we bet 1.99x we have a 50% chance of winning (again, ignoring 0x busts), and so the house edge is:</p>
          <pre>100 - (1.99 * 50) = 100 - 99.5 = 0.5%</pre>
          <p>The extra 0.01 that gets added on to the multiplier is half of the 1% that was taken off in this case, leaving the house edge at 0.5%. As the multiplier gets bigger, the 1% that is taken off gets bigger, and the 0.01x that gets added on becomes less and less significant, causing the house edge to tend to 1%.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default GameBustCalc;