import React, { PureComponent, PropTypes } from 'react'
import { browserHistory } from 'react-router';


import { Modal } from 'react-bootstrap'



class ModalizeSmall extends PureComponent {

	render() {

		let { title, body } = this.props;


		const styles = {
			body: {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center'
			}
		}

		return (
			<Modal show={true} bsSize="small"
						 aria-labelledby="contained-modal-title-lg"
						 onHide={() => browserHistory.push('/')}>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-sm">{ title }</Modal.Title>
				</Modal.Header>
				<Modal.Body style={styles.body}>
					{ body }
				</Modal.Body>
			</Modal>
		)
	}
}

ModalizeSmall.propTypes = {
	title: PropTypes.object.isRequired,
	body: PropTypes.node.isRequired
};

export default ModalizeSmall;