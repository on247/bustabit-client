import React, { Component } from 'react';
import AddChat from './add-chat';
import ChatChannelSidebar from './chat-channel-sidebar'
import ChatHistory from './chat-history'
import browserSize from '../../core/browser-size'
import refresher from '../../refresher'


class Chat extends Component {

  render() {

		const { height } = browserSize;

   /* const items = chat.focusedHistory().map((item, i) =>
      <li key={i}>
        <small>{simpleDate(item.created)}</small>
        <b> {item.uname}: </b>
        {item.message}
      </li>); */


    let chatContainerHeight = (((height - (browserSize.topBarHeight()+browserSize.marginsHeight())) * browserSize.bottomWidgetHeight() ) - (browserSize.previousCrashesHeight() + browserSize.addChatHeight())) +'px'


    const chatChannelContainer = {
        height: chatContainerHeight,
        position: 'absolute',
        top: browserSize.isMobile() ? '20px' : '70px',
        right: '2rem',
        width: browserSize.width < 600 ? '20%' : '10%',
        overflowY: 'scroll',
        overflowX: 'hidden',
      };

    return (
      <div>
        <ChatHistory />
        <div style={chatChannelContainer} className="chat-channel-container">
          <ChatChannelSidebar />
        </div>
          <div>
            <AddChat />
          </div>
      </div>
    )
  }

}


export default refresher(Chat,
  [browserSize, 'HEIGHT_CHANGED', 'WIDTH_CHANGED']
)


// HELPERS

// String -> String
//
// Converts timestamp string into HH:MM format for chat
/*
function simpleDate (date) {
	const hh = date.getHours().toString();
	const mm = date.getMinutes().toString();
	return ('00' + hh).slice(-2) + ':' + ('00' + mm).slice(-2);
}

*/