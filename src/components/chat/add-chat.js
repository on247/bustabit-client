import React, { Component } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap'
import notification from '../../core/notification';
import socket from '../../socket'
import chat  from '../../core/chat'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher'
import { formatBalance } from '../../util/belt'

class AddChat extends Component {
  constructor(props) {
    super(props);
		this.firstInput = null; // this is a ref
		this.state = {
			message: ''
    }
  }

  getError(){
  	return  userInfo.uname ? null : 'You must be logged in to chat.';
	}


	componentDidMount(){
	this.addChatInput.focus();
}

  submit(event) {
		event.preventDefault();

		const { message } = this.state;

		this.setState({ message: '' });


		const p = chat.focusKind === 'UNAME' ? (
			socket.send('privateMessage', {
				uname: chat.focused,
				message
			})
		) : (
			socket.send('say', {
				channel: chat.focused,
				message,
			})
		);

    return p.catch(err => {
    	const prefix = 'NOT_WAGERED_ENOUGH:';

    	if (typeof err === 'string' && err.startsWith(prefix)) {
				const amount = err.slice(prefix.length);
				notification.setMessage(<span><span className="red-tag">Error </span> In order to prevent spam, we require that you wager at least { formatBalance(amount) } bits more in order to chat</span>, 'error');
			} else {
				console.error(err);
				notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
			}
    })
  }


  onMessageChange(e) {
		const message = e.target.value;
		this.setState({ message });
	}

  render () {
    const {  message }  = this.state;

    const error = this.getError();

    return (
      <Form horizontal onSubmit={ e => this.submit(e) }>
            <InputGroup className={ error ? 'has-error' : ''}>
              <input type="text"
                className="form-control chat-input"
								placeholder={ error || 'Message ...'}
								value={ message }
										 ref={(input) => { this.addChatInput = input; }}
										 onChange={ e => this.onMessageChange(e) }
										 disabled={ error }
										 maxLength="1000"
							/>
              <InputGroup.Button>
                <Button className="chat-rooms-btn" onClick={ () => chat.setShowAddChannels(!chat.showAddChannels) }>
                  <i className="fa fa-comments-o"></i>
                </Button>
              </InputGroup.Button>
            </InputGroup>
      </Form>
    );
  }
}

export default refresher(AddChat,
	[userInfo, 'UNAME_CHANGED']
);

