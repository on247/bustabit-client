import React, { PropTypes, PureComponent } from 'react'
import { confirmable } from 'react-confirm';

import { Modal, Col, Row } from 'react-bootstrap'

class Confirmation extends PureComponent {

	render() {
		const {
			okLabel = 'Accept',
			cancelLabel = 'Cancel',
			title = 'Please Confirm',
			confirmation,
			show,
			proceed,
			cancel
		} = this.props;

		return (
			<Modal show={show} onHide={cancel} bsSize="small" dialogClassName="modal-dialog-confirmation">
				<Modal.Header bsClass="modal-header-confirmation" closeButton>
					<Modal.Title id="contained-modal-title-sm">{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{confirmation}
					<Row style={{marginTop: '20px'}}>
						<Col xs={12} className="text-center">
							<button className="btn btn-success" onClick={() => proceed('OK clicked')}>{okLabel}</button>
						</Col>
						<Col xs={12} className="text-center">
							<button className="btn btn-danger" onClick={() => cancel('Cancel clicked')}>{cancelLabel}</button>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>
		)
	}
}

Confirmation.propTypes = {
	show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
	proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
	cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
	confirmation: PropTypes.string,  // arguments of your confirm function
}

export default confirmable(Confirmation);

