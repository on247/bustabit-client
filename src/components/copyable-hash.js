import React, { PureComponent, PropTypes } from 'react';
import { InputGroup, FormGroup } from 'react-bootstrap'



export default class CopyableHash extends PureComponent {
	constructor(props) {
		super(props);
		this.hash = null; // this a ref
	}

	copyToClipboard() {
		this.hash.select();

		try {
			document.execCommand('copy');
		} catch (err) {
			console.error('Error. Unable to copy', err);
		}
	}

	render() {
		return (
			<FormGroup style={{marginBottom: 0}}>
				<InputGroup>
					<input value={this.props.hash}
								 ref={(input) => { this.hash = input } }
								 className="form-control"
								 readOnly/>
					<InputGroup.Button>
						<button
							onClick={() => this.copyToClipboard() }
							className="btn btn-default form-control">
							<i className="fa fa-clipboard"></i>
						</button>
					</InputGroup.Button>
				</InputGroup>
			</FormGroup>
		)
	}

}

CopyableHash.propTypes = {
	hash: PropTypes.string.isRequired
};

