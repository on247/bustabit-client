import React, { Component } from 'react';
import  { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { chatChannels } from '../../util/belt'
import chat from '../../core/chat'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher'
import { Link } from 'react-router'


class ChatChannels extends Component {

	canAddFriend() {
		if (!userInfo.uname) return '';

		return <Link className="btn btn-xs btn-success" to="/add-friend">
        <i className="fa fa-user"></i> Add
      </Link>

	}

  render() {

    return (
      <div className="chat-rooms-container col-sm-10">

          {chatChannels.map(function(channel) {
            let tooltip = (
              <Tooltip id="tooltip">{channel.name}</Tooltip>
            );


            return (
              <OverlayTrigger placement="bottom" overlay={tooltip} key={channel.name}>
                  <img
                    key={channel.name}
                    src={channel.url}
                    style={{ width: '32px' }}
										onClick={ () => chat.openChannel(channel.name) }
                    alt={channel.name}
                  />
              </OverlayTrigger>
            );
          })}
				{this.canAddFriend()}

      </div>
    )
  }


}

export default refresher(ChatChannels,
	[userInfo, 'UNAME_CHANGED']
);

