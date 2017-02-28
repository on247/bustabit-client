import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'
import { formatBalance } from '../../util/belt'
import { tipFee } from '../../util/config'
class TipFee extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What is the tip fee?</h3>
          <p>Everytime you tip someone, you will be requested to pay a {formatBalance(tipFee)} { tipFee !== 100 ? ' bits' :' bit'} tip fee. This fee is considered as a processing fee and applies to any tipping currency: bits, valor or silver.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default TipFee;