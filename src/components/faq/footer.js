import React, { Component } from 'react'
import {  Col, Row } from 'react-bootstrap'
import { Link, browserHistory } from 'react-router';

class FaqFooter extends Component {

  render() {

    return (
        <Row>
          <hr />
          <Col sm={12} xs={24} className="text-center" style={{marginTop:'10px'}}>
            <button onClick={browserHistory.goBack} className="btn btn-info"><i className="fa fa-chevron-circle-left"></i> Go Back</button>
          </Col>
          <Col sm={12} xs={24} className="text-center" style={{marginTop:'10px'}}>
            <Link to="/faq" className="btn btn-success"><i className="fa fa-info-circle"></i> FAQ Menu</Link>
          </Col>
        </Row>

    )
  }
}



export default FaqFooter;