import React, { PureComponent } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class GamblingAddiction extends PureComponent {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>Do you have gambling addiction?</h3>
          <p>Gambling addiction, also known as compulsive gambling, is a type of impulse-control disorder. Compulsive gamblers can’t control the impulse to gamble, even when they know their gambling is hurting themselves or their loved ones. Gambling is all they can think about and all they want to do, no matter the consequences. Compulsive gamblers keep gambling whether they’re up or down, broke or flush, happy or depressed. Even when they know the odds are against them, even when they can’t afford to lose, people with a gambling addiction can’t "stay off the bet".</p>
          <p>
            Gamblers can have a problem, however, without being totally out of control. Problem gambling is any gambling behavior that disrupts your life. If you’re preoccupied with gambling, spending more and more time and money on it, chasing losses, or gambling despite serious consequences, you have a gambling problem.
          </p>
          <p>
            If you think you have this problem please visit one of these sites to get assistance:
          </p>
          <p>UK: <a href="http://www.gambleaware.co.uk/" target="_blank">http://www.gambleaware.co.uk/</a></p>
          <p>US: <a href="http://www.ncpgambling.org/help-treatment/help-by-state/" target="_blank">http://www.ncpgambling.org/</a></p>
          <p>Self Help: <a href="http://www.gamblersanonymous.org/ga/" target="_blank">http://www.gamblersanonymous.org/ga/</a></p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default GamblingAddiction;