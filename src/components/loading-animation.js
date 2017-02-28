import React, { PureComponent } from 'react'
import { Col, Row } from 'react-bootstrap'



export default class LoadingAnimation extends PureComponent {

	render() {
		return (
			<Row style={{margin: '15px 0px'}}>
				<Col xs={24} className="text-center">
					<i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
				</Col>
			</Row>
		)
	}


}