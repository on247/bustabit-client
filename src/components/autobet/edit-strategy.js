import React, { Component } from 'react';
import { Form, FormGroup, Col, InputGroup } from 'react-bootstrap'

const initialScript = `var config = {
	baseBet: { value: 100, type: 'balance' },
	autoCashOut: { value: 1, type: 'multiplier' },
};

engine.on('gameStarting', function() {
	engine.bet(config.baseBet.value, config.autoCashOut.value))
})`;

function validateName(name) {
	if (!name)
		return 'Please enter a name.'
}

class Autobet extends Component {

	constructor(props) {
		super();
		this.state = {
			name: 'Flat Better',
			script: props.script || initialScript,
			nameError: null
		}
	}

	onNameChange(event) {
		const name = event.target.value;
		const nameError = validateName(name);
		this.setState({name, nameError});
	}

	render() {
		const { name, nameError, script } = this.state;

		return (
			<Col xs={24}>
				<Form>
					{ nameError && <strong className="red-error">{nameError}</strong>}
					<FormGroup  className={ nameError ? 'has-error' : ''}>
						<InputGroup>
							<InputGroup.Addon>
								Name:
							</InputGroup.Addon>
							<input type="text"
										 name="name"
										 className="form-control"
										 value={name}
										 onChange={(event) => this.onNameChange(event)}
							/>
						</InputGroup>
					</FormGroup>
					<textarea className="form-control" rows={6} value={script} onChange={ event => this.setState({ script: event.target.value })} />
					<Col xs={12} style={{marginTop: '15px'}}><button className="btn btn-danger">Cancel</button></Col>
					<Col xs={12} style={{marginTop: '15px'}}><button className="btn btn-success">Save</button></Col>
				</Form>
			</Col>

		);
	}

}


export default Autobet;