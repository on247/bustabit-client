import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class HowCanIContributeAsBankroller extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How can I contribute to the growth of the site as a bankroller?</h3>
          <p>Having players and bankrollers is both important for a good performance of Bustabit. As we grow the bankroll base, higher rolls will be allowed, and therefore, bigger gamblers will be attracted to the game.</p>
          <p>If you wish to contribute, word of mouth is the most powerful to attract people both to play and be part of the bankroll in Bustabit. Please recommend the game to your friends.</p>
          <p>Some helpful ideas to promote the website are:</p>
          <ul>
            <li>
              Add a link to Bustabit.com in your BitcoinTalk.org signature.
            </li>
            <li>
              Add the Bustabit banner to your bitcoin site.
            </li>
            <li>
              Write a review of Bustabit in a niche forum in your native language.
            </li>
          </ul>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default HowCanIContributeAsBankroller;