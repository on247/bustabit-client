import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap'
import socket from '../socket'
import notification from '../core/notification'
import { validateUname } from '../util/belt'
import {  browserHistory } from 'react-router'
import userInfo from '../core/userInfo'
import refresher from '../refresher';
import NotLoggedIn from './not-logged-in-well'
class AddFriend extends Component {

	constructor(props) {
		super(props);
		this.firstInput = null; // this is a ref
		this.state = {
			uname: '',
			unameError: '',
			submitting: false,
			touched: false

		};
	}
	componentDidMount(){
		this.firstInput.focus();
	}

	// this returns true if the form is valid
	validate(values) {
		const unameError = validateUname(values.uname);
		this.setState({unameError});
		return !unameError;
	}

	onUnameChange(event) {
		const uname = event.target.value;
		const unameError = this.state.touched ? validateUname(uname) : null;
		this.setState({uname, unameError});
	}

	handleSubmit(event) {
		event.preventDefault();
		let {uname} = this.state;

		if (this.validate(this.state)) {
			this.setState({ submitting: true, touched: true });
			return socket
				.send('addFriend', uname)
				.then(info => {
					notification.setMessage(<span><span className="green-tag">Success!</span> You added {uname} to your friend list.</span>);
					this.setState({ submitting: false });
					browserHistory.push('/');
				}, err => {
					this.setState({ submitting: false });
					if (err === 'UNAME_NOT_FOUND') {
						this.setState({
							unameError: 'This username doesn\'t exist.'
						})
					}
					else {
						console.error(err);
						notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
					}
				})
		}
	}

  render() {
		const { uname, unameError } = this.state;
    return (
      <Col sm={16} xs={20}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Form horizontal className="text-center" onSubmit={(event) => this.handleSubmit(event)}>
						{ unameError && <strong className="red-error">{unameError}</strong>}
            <input className={unameError ? 'form-control has-error' : 'form-control'}
									 placeholder="Friend's Username"
									 value={uname}
									 ref={(input) => { this.firstInput = input; }}
									 onChange={(event) => this.onUnameChange(event)}
						/>
            <button type="submit"
                    className="btn btn-success"
                    style={{marginTop: '15px'}}
										disabled={ this.state.submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
            </button>
          </Form>
        </div>
      </Col>
    )
  }
}


function addFriendWrapper() {
	if (!userInfo.uname) { return <NotLoggedIn/> }
	return <AddFriend />
}

export default refresher(addFriendWrapper,
	[userInfo, 'UNAME_CHANGED']
);