import EventEmitter from 'events';
import notification from './notification'
import { formatBalance } from '../util/belt'
import socket from '../socket';
import chat from './chat'

// events, balance-changed

// events:
//  UNAME_CHANGED:    called during login/log out the uname changes
//  BALANCE_CHANGED:  the balance/silver/valor has changed
//  BANKROLL_STATS_CHANGED: The bankroll{Stake, HighWater}, invested or divested changed
//  HAS_MFA_CHANGED
//  EMERGENCY_WITHDRAWAL_ADDRESS_CHANGED
//  EMAIL_CHANGED

class UserInfo extends EventEmitter {

  constructor() {
    super();
		this.setMaxListeners(100);
		this.initialize();
  }

  initialize() {
		this.balance = 0.0;
		this.bets = 0;
		this.created = new Date();
		this.divested = 0;
		this.email = '';
		this.emergencyWithdrawalAddress = '';
		this.hasMFA = false;
		this.kind = 'MEMBER'; // Can be MEMBER | TRUSTED | ADMIN
		this.highWater = 0;
		this.invested = 0;
		this.profit = 0;
		this.profitATH = 0;
		this.profitATL = 0;
		this.silver = 0.0;
		this.stake = 1;
		this.uname = '';
		this.unpaidDeposits = 0;
		this.valor = 0.0;
		this.wagered = 0.0;
	}

	isTrusted() {
  	return this.kind === 'TRUSTED' || this.kind === 'ADMIN';
	}
  
  isLoggedIn() {
    return !!this.uname;
  }

  logIn(info) {
		console.assert(typeof info === 'object');
		console.assert(typeof info.uname === 'string');
		console.assert(typeof info.created === 'string');

		info.created = new Date(info.created);

		Object.assign(this, info);

		// all events should be emitted
	  this.emit('UNAME_CHANGED');
		this.emit('BALANCE_CHANGED');
		this.emit('BANKROLL_STATS_CHANGED');
		this.emit('HAS_MFA_CHANGED');
		this.emit('EMERGENCY_WITHDRAWAL_ADDRESS_CHANGED');
	}

	logOut() {
		this.initialize();

		// all events should be emitted
		this.emit('UNAME_CHANGED');
		this.emit('BALANCE_CHANGED');
		this.emit('BANKROLL_STATS_CHANGED');
		this.emit('HAS_MFA_CHANGED');
		this.emit('EMERGENCY_WITHDRAWAL_ADDRESS_CHANGED');
	}

  // increase the balance by amount
  changeBalance(amount) {
  	if (amount === 0) return;
    this.balance += amount;
    this.emit('BALANCE_CHANGED', amount);
  }

  // this also adds valor, but also probably will do something
	// different for the animations point of view (as it's not really a loss)
  changeBalanceFromBet(amount) {
		this.balance -= amount;
		this.valor += amount / 100;
		this.emit('BALANCE_CHANGED', -amount);
	}

	fuse(amount) {
		this.balance += amount;
		this.valor -= amount;
		this.silver -= amount;
		this.emit('BALANCE_CHANGED', amount);
	}

  invest(amount, newStake) {
		this.highWater += amount;
		this.stake = newStake;

		// we have to call this last, because it has a sync emit:
		this.changeBalance(-amount);

		this.emit('BANKROLL_STATS_CHANGED');
	}

	divest(amount, silver, newStake) {

		this.highWater -= amount;
		this.stake = newStake;
		this.silver += silver;

		// we have to call this last, because it has a sync emit:
		this.changeBalance(amount);

		this.emit('BANKROLL_STATS_CHANGED');
	}

	setHasMFA(b) {
  	if (this.hasMFA === b) return;

  	this.hasMFA = b;
  	this.emit('HAS_MFA_CHANGED');
	}

	setEmergencyWithdrawalAddress(address) {
  	this.emergencyWithdrawalAddress = address;
  	this.emit('EMERGENCY_WITHDRAWAL_ADDRESS_CHANGED')
	}

	setEmail(email) {
		this.email = email;
		this.emit('EMAIL_CHANGED')
	}

}



let userInfo = new UserInfo(); // should be const, but confuses webstorm..

window._userInfo = userInfo; // for debugging:


socket.on('balanceChanged', function(amount) {
	console.assert(typeof amount === 'number');
	userInfo.changeBalance(amount);
});

socket.on('fused', amount => {
	userInfo.fuse(amount);
});

socket.on('logout', () => {
	localStorage.removeItem('secret');
	userInfo.logOut();
	chat.friends.clear();
});

socket.on('hasMFAChanged', b => {
	userInfo.setHasMFA(b);
});

socket.on('deposit', d => {
	console.assert(typeof d.amount === 'number');
	userInfo.changeBalance(d.amount);

	if (d.amount > 0) {
		notification.setMessagenotification.setMessage("Your account has been credited "  + formatBalance(d.amount) + " bits from deposit " + d.txid);
	} else {
		// TODO: much smarter notifications...
		notification.setMessage("deposit detected")
	}


});

socket.on('tipped', d => {
	if (d.toUname === userInfo.uname) {
		console.assert(typeof d.amount === 'number');
		switch(d.currency) {
			case "BALANCE":
				userInfo.balance += d.amount;
				break;
			case "VALOR":
				userInfo.valor += d.amount;
				break;
			case "SILVER":
				userInfo.silver += d.amount;
				break;
			default:
				break;
		}
		userInfo.emit('BALANCE_CHANGED', d.amount);
	}
	if (d.uname === userInfo.uname)  {
		console.assert(typeof d.amount === 'number');
		switch(d.currency) {
			case "BALANCE":
				userInfo.balance -= (d.amount + d.fee);
				break;
			case "VALOR":
				userInfo.valor -= d.amount;
				userInfo.balance -= d.fee;
				break;
			case "SILVER":
				userInfo.silver -= d.amount;
				userInfo.balance -= d.fee;
				break;
			default:
				break;
		}
		userInfo.emit('BALANCE_CHANGED', d.amount);
	}
});




socket.on('emergencyWithdrawalAddressChanged', address => {
	userInfo.setEmergencyWithdrawalAddress(address);
});


socket.on('emailUpdated', email => {
	userInfo.setEmail(email);
});

export default userInfo;