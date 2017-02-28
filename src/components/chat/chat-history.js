import React, { Component } from 'react';
import browserSize from '../../core/browser-size'
import chat      from '../../core/chat'
import refresher from '../../refresher'
import PopoverMenu from './popover-menu'
import userInfo from '../../core/userInfo'

class ChatHistory extends Component {

	componentDidUpdate() {
		this.ul.scrollTop = this.ul.scrollHeight;
	}


	leaveChat(channel) {
		chat.leaveChannel(channel);
	}

	render() {

		const { height } = browserSize;

		// TODO: using i isn't brilliant for the key, as they might dupe (when we shift)
		// The uname has been made a button so that the overlay can work with trigger 'focus'
		const items = chat.focusedHistory().map((item, i) => {
			// Notifications have no username
			if (item.isNotification) {
				return 	<li key={i} style={{ color: 'red' }}>
					{item.message}
				</li>
			}

			return <li key={i}>
				<small>{simpleDate(item.created)}</small>
				<PopoverMenu uname={item.uname}
										 isFriend={chat.isFriend(item.uname)}
										 isTrusted={userInfo.isTrusted()}
										 isSelf={item.uname === userInfo.uname}
										 userLoggedIn={userInfo.uname}
				>
					<button className="no-btn"> {item.uname}: </button>
				</PopoverMenu>
				{item.message}
			</li>


		});


//Height
// Desktop: height of window minus [52px of the top bar +  margins in between objects 30px] multiplied by 55%. Minus previous crashes 32px + add_chat 34px
// Mobile: height of window minus [43px of the top bar +  margins in between objects 10px] multiplied by 55%. Minus previous crashes 33px + add_chat 34px
// 20 is the height of channel-title

    let chatContainerHeight = (((height - (browserSize.topBarHeight() + browserSize.marginsHeight())) * browserSize.bottomWidgetHeight() )
			- (browserSize.previousCrashesHeight() + browserSize.addChatHeight() + 20)) +'px';



		const chatContainer = {
				height: chatContainerHeight,
				overflowY: 'scroll',
				overflowWrap: 'break-word',
				margin: '0px',
				paddingRight: browserSize.width < 600 ? '22%' : '12%',
		};

		return (
			<div>
				<div className="channel-title">
					<PopoverMenu uname={chat.focused}
											 isFriend={chat.isFriend(chat.focused)}
											 isTrusted={userInfo.isTrusted()}
											 isSelf={userInfo.uname === chat.focused}
											 userLoggedIn={userInfo.uname}
					>
						<button className="no-btn"><i className="fa fa-bars"></i></button>
					</PopoverMenu>
					{chat.focused}
					<button className="no-btn" onClick={(channel) => this.leaveChat(chat.focused)}><i className="fa fa-times"></i></button>
				</div>
      <ul className="chat-container" style={chatContainer} ref={ ul => this.ul = ul }>
        { items }
			</ul>
			</div>
		)
	}

}


export default refresher(ChatHistory,
	[browserSize, 'HEIGHT_CHANGED'],
	[chat, 'FOCUSED_HISTORY_CHANGED'],
	[userInfo, 'UNAME_CHANGED']
)


// HELPERS


// String -> String
//
// Converts timestamp string into HH:MM format for chat
function simpleDate (date) {
	const hh = date.getHours().toString();
	const mm = date.getMinutes().toString();
	return ('00' + hh).slice(-2) + ':' + ('00' + mm).slice(-2);
}

