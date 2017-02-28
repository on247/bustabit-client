import React, { PureComponent } from 'react'
import { Link } from 'react-router'



export default class NotLoggedIn extends PureComponent {

	render() {
		return (
			<div className="well text-center" style={{margin: '15px'}}>
				<h4>
					Please <Link to="/login">login</Link> or <Link to="/register">register</Link> first.
				</h4>
			</div>
		)
	}


}