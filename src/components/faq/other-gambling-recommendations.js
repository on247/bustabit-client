import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class OtherGamblingRecommendations extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What other gambling places do you recommend?</h3>
          <p>A couple quick pointers: the lower the house edge the more variance you will experience which means a longer, more exciting gaming session. Bitcoin Casinos generally offer better odds, less fees and faster deposits and withdrawals than fiat based casinos. Be extremely skeptical of generous reward programs, bonuses (e.g. deposit bonuses), affiliate programs and the likes. The money comes from somewhere: you.</p>
          <p>
            Instead of listing our favorites here, we'll defer to the excellent <a href="https://thebitcoinstrip.com/" target="_blank">Bitcoin Strip</a>.
          </p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default OtherGamblingRecommendations;