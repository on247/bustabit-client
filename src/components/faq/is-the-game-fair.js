import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class IsTheGameFair extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>Is the game fair?</h3>
          <p>Absolutely! And we can prove it. Please see: <a href="https://bitcointalk.org/index.php?topic=922898.0" target="_blank">the bitcoin talk thread</a> for technical details.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default IsTheGameFair;