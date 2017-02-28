import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class GrossProfit extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What is gross profit?</h3>
          <p>Gross profit refers to the sum of the profit from each game you've played without considering your loses.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default GrossProfit;