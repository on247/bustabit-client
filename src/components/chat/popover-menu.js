import React, { PureComponent, PropTypes } from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router'
import confirm from '../../util/confirmation'
import notification from '../../core/notification'
import socket from '../../socket'


class PopoverMenu extends PureComponent {

	addFriend(uname) {
		const confirmMessage = 'Are you sure you want to add ' + uname + ' to your friend list?';

		confirm(confirmMessage).then(
			(result) => {
				// `proceed` callback
				socket.send('addFriend', uname)
					.then(() => {
							browserHistory.push('/');
							notification.setMessage(<span><span className="green-tag">Success!</span> {uname} has been added to your friend list.</span>);
						},
						err => {
							console.error('Unexpected server error: ' + err);
							notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
						}
					)
			},
			(result) => {
				// `cancel` callback
				console.log(result)
			}
		)
	}


	removeFriend(uname) {

		const confirmMessage = 'Are you sure you want to remove ' + uname + ' from your friend list?';

		confirm(confirmMessage).then(
			(result) => {
				// `proceed` callback
				socket.send('removeFriend', uname)
					.then(() => {
							browserHistory.push('/');
							notification.setMessage(uname + ' has been removed from your friend list.');
						},
						err => {
							console.error('Unexpected server error: ' + err);
							notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
						}
					)
			},
			(result) => {
				// `cancel` callback
				console.log(result)
			}
		)
	}

	addOrRemoveFriend() {
		const { uname, isFriend, isSelf, userLoggedIn } = this.props;
		let removeFriend = <li style={{ cursor: 'pointer'}}
														 onClick={ () => this.removeFriend(uname)}>
			<i className="fa fa-times" aria-hidden="true"></i> Remove from Friends</li>
		let addFriend = 	<li style={{ cursor: 'pointer'}}
													onClick={ () => this.addFriend(uname)}>
			<i className="fa fa-plus" aria-hidden="true"></i> Add to Friends</li>
		if ( !userLoggedIn || isSelf ) {
			addFriend = ''
			removeFriend = ''
		}

		if (isFriend) {
			return removeFriend
		} else {
			return addFriend
		}
	}

	canMessage() {
		const {uname, isFriend, isSelf, userLoggedIn} = this.props;
		if (!userLoggedIn || isSelf || !isFriend)
			return '';
		return ( <li style={{cursor: 'pointer'}}
								 onClick={ () => console.log('TODO: This callback will send a pm to: ' + uname)}>
				<i className="fa fa-commenting-o" aria-hidden="true"></i> Message</li>
		);
	}

	canTip() {
		const { uname, isSelf, userLoggedIn } = this.props;
		if ( !userLoggedIn || isSelf )
			return '';
		return <li><Link to={{ pathname: '/tip', query: { uname: uname } }}><i className="fa fa-btc" aria-hidden="true"></i> Tip</Link></li>;
	}

	canBlock() {
		const { isSelf, userLoggedIn } = this.props;
		if ( !userLoggedIn || isSelf )
			return '';
		return  <li><i className="fa fa-ban" aria-hidden="true"></i> Block</li>
	}


	canMute() {
		const { uname, isSelf, isTrusted } = this.props;

		if ( !isTrusted || isSelf )
			return '';

		return  <li><Link to={{ pathname: '/mute', query: { uname: uname } }}><i className="fa fa-microphone-slash" aria-hidden="true"></i> Mute</Link></li>
	}


	render() {

		const { uname } = this.props;
			const popover = (
				<Popover id="popover" title={this.props.title ? uname : false} className="popover-menu">
					<ul style={{listStyle: 'none', paddingLeft: '0px', marginBottom: '0px'}}>
						{this.canMessage()}
						<li><Link to={'/user/' + uname}><i className="fa fa-line-chart" aria-hidden="true"></i> View Stats</Link></li>
						{this.canTip()}
						{this.addOrRemoveFriend()}
						{this.canMute()}
						{this.canBlock()}
					</ul>
				</Popover>
			);

		return (
				<OverlayTrigger trigger="focus"
												placement="right"
												overlay={popover}
				>
					{this.props.children}
				</OverlayTrigger>
			)
		}

	}

PopoverMenu.propTypes = {
	uname: PropTypes.string.isRequired,
	key: PropTypes.string,
	isFriend: PropTypes.bool.isRequired,
	isSelf: PropTypes.bool.isRequired,
	isTrusted: PropTypes.bool.isRequired,
	userLoggedIn: PropTypes.string.isRequired  //this is the uname of person logged in the client, comes from userInfo
};

export default PopoverMenu;


