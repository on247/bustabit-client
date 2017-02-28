import React, { PureComponent } from 'react';
import socket from '../socket'
import { browserHistory } from 'react-router'
import { Form } from 'react-bootstrap'
import notification from '../core/notification'


class Logout extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			submitting: false
		};
	}
  _handleLogout(event) {
    event.preventDefault();
		this.setState({ submitting: true });
    console.log('Logout triggered.');
    return socket
      .send('logout')
      .then( () => {
					this.setState({ submitting: false });
          browserHistory.push('/');
					notification.setMessage(<span><span className="green-tag">Success!</span> You have been logged out.</span>);
				}
      )
  }
  render() {
    return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h4 className="text-center">Are you sure you want to logout?</h4>
        <Form horizontal onSubmit={(event) => this._handleLogout(event)}>
            <button type="submit"
                    className='btn btn-danger btn-lg'
                    style={{marginTop: '25px'}}
										disabled={ this.state.submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Logout'}
            </button>
          </Form>
      </div>
    </div>
    )
  }
}


export default Logout;

