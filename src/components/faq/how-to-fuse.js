import React, { PureComponent } from 'react'
import {  Col } from 'react-bootstrap'
import FaqFooter from './footer'
import { Link } from 'react-router'

class HowToFuse extends PureComponent {

  render() {

    return (
      <div>
        <Col xs={24}>
          <h3>How can I fuse valor with silver?</h3>
          <p>1 <Link to="/faq/what-is-valor">valor</Link> and 1 <Link to="/faq/what-is-silver">silver</Link> can be fused into 1 <Link to="/faq/what-is-a-bit">bit</Link>.
            You can use the fuse widget <Link to="/fuse">here</Link>.</p>
        </Col>
        <FaqFooter />
      </div>

    )
  }
}



export default HowToFuse;