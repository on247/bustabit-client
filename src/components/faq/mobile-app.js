import React, { Component } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'

class MobileApp extends Component {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>Do you have a mobile app for Iphone or Android?</h3>
          <p>We don't have an iOS or Android app. Our website is fully optimized to run from your mobile's browser though, so you won't have any problems if you decide to play from your phone.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default MobileApp;