import React, { PureComponent, PropTypes } from 'react'
import {  Row } from 'react-bootstrap'


class FaqContainer extends PureComponent {

  render() {

    let { body } = this.props;
    return (
      <Row>
          { body }
      </Row>
    )
  }
}

FaqContainer.propTypes = {
	body: PropTypes.node.isRequired
};

export default FaqContainer;