import React, { PureComponent, PropTypes } from 'react'


class ChatOrHistorySwitch extends PureComponent {

    render() {
        const { currentTab, onChange }  = this.props;
        return (
          <div className="switch">
            <input type="radio"
									 className="switch-input"
									 value="chat"
									 id="chat"
									 checked={ currentTab === 'chat'}
									 onChange={ onChange }/>
						<label htmlFor="chat" className="switch-label switch-label-off">Chat</label>
						<input type="radio"
									 className="switch-input"
									 value="history"
									 id="history"
									 checked={ currentTab === 'history'}
									 onChange={ onChange }/>
						<label htmlFor="history" className="switch-label switch-label-on">History</label>
						<span className="switch-selection"></span>
          </div>
        )
    }
}

ChatOrHistorySwitch.propTypes = {
	currentTab: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};

export default ChatOrHistorySwitch;
