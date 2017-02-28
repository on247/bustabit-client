import React, { PureComponent } from 'react'
import { Row, Form, Col } from 'react-bootstrap'
import socket from '../../socket'
import { browserHistory } from 'react-router'
import userInfo from '../../core/userInfo';
import refresher from '../../refresher';
import notification from '../../core/notification'
import confirm from '../../util/confirmation'


class DeleteAccount extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
			submitting: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
		this.setState({ submitting: true });

		const confirmMessage = 'Are you sure you want to delete your account? This can\'t be undone and everything in your account will be lost forever.';

		confirm(confirmMessage).then(
			(result) => {
				console.log(result);
				socket.send('deleteAccount')
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
            <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Delete Account</h5>
          </Col>
        <Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
          <Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <button className='btn btn-danger btn-lg' type="submit" disabled={ submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Delete Account'}
            </button>
          </Col>
        </Form>
      </Row>

    )
  }
}

export default refresher(DeleteAccount,
	[userInfo, 'UNAME_CHANGED']
);
