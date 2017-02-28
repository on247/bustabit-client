import React, { PureComponent } from 'react'
import chat from '../../core/chat'
import { chatChannelsFlag, getAvatarColor } from '../../util/belt'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import refresher from '../../refresher'
import browserSize from '../../core/browser-size'
import userInfo from '../../core/userInfo'



class ChatChannelSidebar extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			publicChannelsOpen: true,
			onlineFriendsOpen: true,
			offlineFriendsOpen: false
		};
	}

  render() {

		const [ onlineList, offlineList ] = this.friendIcons();
  	const { publicChannelsOpen } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

					<p className="channel-header" onClick={ ()=> this.setState({ publicChannelsOpen: !publicChannelsOpen })}>
						<i className={publicChannelsOpen ? "fa fa-minus-square-o" : "fa fa-plus-square-o"} aria-hidden="true"></i> Channels
					</p>
						<div className={ publicChannelsOpen ? "channels-show" : "channels-collapse"}>
        {
					chat.openChannels().map(channel => {
						const flag = chatChannelsFlag[channel];

						const style = channel === chat.focused && chat.focusKind === 'CHANNEL' ? {border: "5px solid blue"} : {};

						const tooltip = (
							<Tooltip id="tooltip">{channel}</Tooltip>
						);


						return <OverlayTrigger placement={ browserSize.isMobile() ? 'left' : 'right'} overlay={tooltip} key={channel}>
							<img src={flag} alt={channel} style={style}
												onClick={ () => this.onTabClicked(channel, 'CHANNEL') }
							/>
						</OverlayTrigger>
        	})
        }
						</div>

		  { this.embedList(onlineList, 'onlineFriendsOpen', true) }
		  { this.embedList(offlineList, 'offlineFriendsOpen') }

      </div>
    )
  }

	embedList(list, stateName, online) {
		if (list.length === 0) return null;
		const open = this.state[stateName];
		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<p className="channel-header" onClick={ ()=> this.setState({ [stateName]: !open })}>
					<i className={ open ? "fa fa-minus-square-o" : "fa fa-plus-square-o"} aria-hidden="true"></i> { online ? 'Online' : 'Offline'}({list.length})
				</p>
				<div className={ open ? "channels-show" : "channels-collapse"}>
					{list}
				</div>
			</div>
		);

	}


  friendIcons() {
  	const onlineList = [];
  	const offlineList = [];

  	for (const [uname, { online } ] of chat.friends) {

			const tooltip = (
				<Tooltip id="tooltip">{uname}</Tooltip>
			);

			const item = <OverlayTrigger placement={ browserSize.isMobile() ? 'left' : 'right'} overlay={tooltip} key={uname}>
				<button className="no-btn" onClick={() => this.onTabClicked(uname, 'UNAME')}>
						<span className={ online ? 'fa-stack fa-lg online-badge' : 'fa-stack fa-lg offline-badge'}
									style={{ color: getAvatarColor(uname), cursor: 'pointer' }}>
							<i className="fa fa-square fa-stack-2x"></i>
							<span className="fa-stack-1x fa-inverse">{uname[0]}</span>
						</span>
					</button>
				</OverlayTrigger>;

			if (online) {
				onlineList.push(item);
			} else {
				offlineList.push(item);
			}
		}
		return [onlineList, offlineList];
	}


  onTabClicked(name, kind) {

  	if (kind === 'CHANNEL' && name === chat.focused) {
  		chat.leaveChannel(name);
			return;
		}

		chat.focusTab(name, kind)
	}

}

export default refresher(ChatChannelSidebar,
	[chat, 'TABS_CHANGED'],
	[browserSize, 'WIDTH_CHANGED'],
	[userInfo, 'UNAME_CHANGED']
);


