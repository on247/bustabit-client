import React, { Component } from 'react';
import EditStrategy from './edit-strategy'
import Listing from './listing'


class Autobet extends Component {

	constructor() {
		super();
		this.state = {
			showing: 'listing'
		}
	}

	render() {
		const { showing } = this.state;

		if (showing === 'listing') {
			return <Listing onAdd={() => this.setState({ showing: 'edit' })}/>
		}

		if (showing === 'edit') {
			return <EditStrategy/>
		}
	}

}


export default Autobet;