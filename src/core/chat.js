import EventEmitter from 'events';
import socket from '../socket';

// events:
//  TABS_CHANGED: the channel list has changed, or focusedChannel, or friends changed...
//  FOCUSED_HISTORY_CHANGED:  the focused channel history history changed
//  SHOW_ADD_CHANNELS_CHANGED: ...
//  FRIENDS_CHANGED

class Chat extends EventEmitter {

  constructor() {
		super();

		this.setMaxListeners(100);

		this.showAddChannels = false;

		this.focusKind = 'CHANNEL'; // or 'UNAME'
		this.focused = 'english'; // or can be the uname of the person...


		// TODO: local storage or something.. ?
		// map of channel name, to { unread: int,  history: { message, uname, created } }
		this.channels = new Map([
			['english', { unread: 0, history: [] }],
			['polish',  { unread: 0, history: [] }],
			['spanish', { unread: 0, history: []  }]
		]);

		// map of friend uname to  { unread: int, history: { message, uname, created } }
		this.friends = new Map([]);

		socket.on('friendRemoved', uname => {
			this.friends.delete(uname);
			this.emit('TABS_CHANGED');
		});

		socket.on('friendStatus', ({uname, online}) => {
			this.friends.get(uname).online =  online;
			this.emit('TABS_CHANGED');
		});

		socket.on('friendAdded', ({uname, details}) => {
			this.friends.set(uname, details);
			this.emit('TABS_CHANGED');
		});

		socket.on('said', message => {
			const { channel } = message;

			if (!this.channels.has(channel)) {
				console.warn("Chat didn't have channel ", channel, " to append to");
				return;
			}

			message.created = new Date(message.created);

			this.channels.get(channel).history.push(message);
			// TODO: truncate after a certain size

			this.emit('FOCUSED_HISTORY_CHANGED'); // TODO: not strictly accurate...
		});

		socket.on('privateMessaged', message => {


			message.created = new Date(message.created);

			const { uname, to } = message;


			// Since we're not sure which direction the PM was, just search both

			if (this.friends.has(uname)) {
				this.friends.get(uname).history.push(message)
			}
			if (this.friends.has(to)) {
				this.friends.get(to).history.push(message)
			}

			this.emit('FOCUSED_HISTORY_CHANGED'); // TODO: not strictly accurate...
		});

		socket.send('joinChannels', this.openChannels())
		.then(history => this.joinedChannels(history));
	}


	initializeFriends(statusObj) {

		const entries = Object.entries(statusObj);


		for (const [uname, { online, history}] of entries) {
			for (const message of history) {
				message.created = new Date(message.created);
			}
			this.friends.set(uname, { unread: 0, online, history });
		}


		this.friends = new Map(Object.entries(statusObj));
		this.emit('TABS_CHANGED');
	}

	openChannels() {
  	return Array.from(this.channels.keys())
	}

	setShowAddChannels(v) {
		this.showAddChannels = v;
		this.emit('SHOW_ADD_CHANNELS_CHANGED')
	}

	focusTab(name, kind) {
  	this.focused = name;
  	this.focusKind = kind;
		this.emit('TABS_CHANGED');
		this.emit('FOCUSED_HISTORY_CHANGED');
	}

	focusedHistory() {
		const focused = (this.focusKind === 'CHANNEL' ?  this.channels : this.friends).get(this.focused);
		return focused ? focused.history : [];
	}

	joinedChannels(history) {

		const entries = Object.entries(history);
		for (const [channel, messages] of entries) {
			for (const message of messages) {
				message.created = new Date(message.created);
			}
			this.channels.set(channel, { unread: 0, history: messages });
		}

		this.emit('FOCUSED_HISTORY_CHANGED');
	}

	isFriend(uname) {
  	return this.friends.has(uname)
	}

	openChannel(channel) {
  	if (this.channels.has(channel)) {
  		this.focusTab(channel, 'CHANNEL');
  		return;
		}

		this.channels.set(channel, { unread: 0, history: [] });

		// kind of conflating logic, but w/e
		this.focused = channel;
		this.showAddChannels = false;

		this.emit('TABS_CHANGED');
		this.emit('SHOW_ADD_CHANNELS_CHANGED');


		socket.send('joinChannels', [channel])
			.then(history => this.joinedChannels(history));
	}

	leaveChannel(channel) {
		this.channels.delete(channel);

		if (this.focusKind === 'CHANNEL' && channel === this.focused) {
			const { value } = this.channels.keys().next();
			this.focused = value; // might be null
			this.emit('FOCUSED_HISTORY_CHANGED');
		}

		this.emit('TABS_CHANGED');

		socket.send('leaveChannel', channel)
	}

}



let chat = new Chat();

window._chat = chat; // for debugging:

export default chat;