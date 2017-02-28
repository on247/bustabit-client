import React, { PureComponent } from 'react'
import { Row, Form, Col } from 'react-bootstrap'
import socket from '../../socket'
import { browserHistory } from 'react-router'
import userInfo from '../../core/userInfo';
import refresher from '../../refresher';
import notification from '../../core/notification'
import confirm from '../../util/confirmation'


class SelfBan extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			submitting: false
		};
	}

	handleSubmit(event) {
		event.preventDefault();
		this.setState({ submitting: true });

		const confirmMessage = 'Are you sure you want to have your IP banned from the website? This is permanent.';

		confirm(confirmMessage).then(
			(result) => {
				console.log(result);
				socket.send('selfBan')
					.then(() => {
							this.setState({ submitting: false });
							browserHistory.push('/');
							notification.setMessage(<span className="red-color">Your account has been deleted.</span>);
						},
						error => {
							this.setState({ submitting: false });
							switch (error) {
								default:
									console.error('Unexpected server error: ' + error);
									notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {error}.</span>, 'error');
							}
						}
					)
			},
			(result) => {
				this.setState({ submitting: false });
				console.log(result)
			}
		)
	}

	render() {
		const {submitting}  = this.state;
		return (
			<Row>
				<Col sm={24} xs={24} style={{marginTop: '20px'}}>
					<h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Self Ban</h5>
				</Col>
				<Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
					<Col xs={20} xsOffset={2} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<p>If you are having a gambling problem, you can request your IP to be permanently banned from this website.</p>
						<button className='btn btn-danger btn-lg' type="submit" disabled={ submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Ban My IP'}
						</button>
					</Col>
				</Form>
			</Row>

		)
	}
}

export default refresher(SelfBan,
	[userInfo, 'UNAME_CHANGED']
);
