import React, { PureComponent } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

export default class WhatIsSilver extends PureComponent {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>What is silver?</h3>
          <p>All investor profit is realized as silver.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}
