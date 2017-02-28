import React, { PureComponent } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class HowToVerifyGameResults extends PureComponent {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How to verify the game results?</h3>
          <p>There are already 3rd party scripts to verify the game hashes and to calculate the results like this <a href="https://jsfiddle.net/1L1uqcgv/6/embedded/result/" target="_blank">JSFiddle</a>.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default HowToVerifyGameResults;