import React, { PureComponent, PropTypes } from 'react'
import { browserHistory } from 'react-router';


import { Modal } from 'react-bootstrap'



class Modalize extends PureComponent {

  render() {

    let { title, body } = this.props;

    return (
      <Modal show={true} bsSize="large"
             aria-labelledby="contained-modal-title-sm"
             onHide={() => browserHistory.push('/')}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { body }
        </Modal.Body>
      </Modal>
    )
  }
}

Modalize.propTypes = {
	title: PropTypes.object.isRequired,
	body: PropTypes.node.isRequired
};


export default Modalize