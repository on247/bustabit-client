import EventEmitter from 'events';

import socket from '../socket'
import chat from './chat'
import userInfo from './userInfo'
import { dilutionFee }  from '../util/config'
import { growthFunc } from '../util/math'


// POSSIBLE EVENTS:
//  ... GAME_STATE_CHANGED
//  ... BANKROLL_CHANGED
//  ... BET_STATUS_CHANGED  (anything to do with placing new bets...)
//  ... PLAYERS_CHANGED     (anything to do with the player list..)
//  ... HISTORY_CHANGED (new item in the history)


class Engine extends EventEmitter {
  constructor() {
    super();
		this.setMaxListeners(100);


    /** Max bet will be sent by the server in the future, for now is a constant **/
    this.maxBet = 1e8;
    
    
    this.bust = 0;
    this.force = false;



		// This is a mapping of uname to bet amount. All these have not yet cashed out!
		this.playing = new Map();

		// This is an array of cashouts (appended) of  { wager, uname, cashedAt }
		this.cashOuts = [];

		/**
		 * The state of the game
		 * Possible states: GAME_STARTING, GAME_IN_PROGRESS, GAME_ENDED,
		 */
		this.gameState = 'GAME_ENDED';

		/** Creation time of current game. This is the server time, not clients.. **/
		this.created = null;

		/** The game id of the current game */
		this.gameId = null;

		/** How much can be won this game */
		this.maxWin = null;

		/**
		 * Client side times:
		 * if the game is pending, startTime is how long till it starts
		 * if the game is running, startTime is how long its running for
		 * if the game is ended, startTime is how long since the game started
		 */
		this.startTime = 0;  //Note it's in integers..


		/** If you are currently placing a bet
		 * True if the bet was sent to the server but the server has not responded yet
		 *
		 * Cleared in game_started
		 */
		this.placingBet = false;



		/** True if cashing out.. */
		this.cashingOut = false;


		this.wager = 0;  // When playing, this is how much we wagered (otherwise zero)
		this.cashedAt = 0;  // How much we cashed out at (otherwise zero)


		/**
		 * If a number, how much to bet next round
		 * Saves the queued bet if the game is not 'game_starting', cleared in 'bet_placed' by us and 'game_started' and 'cancel bet'
		 */
		this.nextWager = null;

		/** Complements nextWager queued bet with the queued autoCashOut */
		this.nextPayout = null;



		/** Store the id of the timer to check for lag **/
		this.tickTimer = null;

		/** Tell if the game is lagging but only  when the game is in progress **/
		this.lag = false;

		/** The hash of the last game **/
		this.lastHash = null;

		/** Animation Events triggers**/
		this.nyan = false;

		this.bankroll = 0;
		this.invested = 0; // how much in total has been invested
		this.divested = 0; // how much in total has been divested

		// an array of { gameId, bust, hash, wager, cashOut }
		this.history = [];

		}

		_getElapsedTime() {
			return Date.now() - this.startTime;
		}


		getElapsedTimeWithLag() {
			if(this.gameState === 'GAME_IN_PROGRESS') {
				if (this.lag) {
					return this.lag - this.startTime;
				} else {
					return this._getElapsedTime();
				}
			} else {
				return 0;
			}
		}

		getCurrentPayout() {
			const ms = this.getElapsedTimeWithLag();
			return growthFunc(ms);
		}

		/** If the user is currently playing return and object with the status else return undefined **/
		getCurrentBet() {
			if (!userInfo.uname)
				return undefined;

			return this.playing.get(userInfo.uname);
		}

		/** True if you are playing and haven't cashed out, it returns true on game_crash also, it clears until game_starting **/
		currentlyPlaying() {
			return this.getCurrentBet() !== undefined;
		}

		// If the game is starting and we're going to be in it
		isEnteringGame() {
			return this.gameState === 'GAME_STARTING' && this.playing.has(userInfo.uname);
		}


		bet(wager, payout) {
			// TODO: if we're a few miliseconds before GAME_STARTED, perhaps we should queue instead of failing?
			if (this.gameState === 'GAME_STARTING') {
				if (this.placingBet || this.wager) {
					console.warn('You were already placing a bet');
					return;
				}

				this.placingBet = true;

				this.emit('BET_STATUS_CHANGED');

				return socket.send('bet', { wager, payout });
			} else {
				this.nextWager = wager;
				this.nextPayout = payout;
			}

			this.emit('BET_STATUS_CHANGED');
			return Promise.resolve(true);
		}

		isBetQueued() {
			return !!this.nextWager;
		}

		cancelQueuedBet() {
			this.nextWager = null;
			this.nextPayout = null;
			this.emit('BET_STATUS_CHANGED');
		}

		sendCashOut() {
			console.assert(this.gameState === 'GAME_IN_PROGRESS');
			console.assert(this.currentlyPlaying());

			this.cashingOut = true;
			socket.send('cashOut', this.getCurrentPayout());
			this.emit('BET_STATUS_CHANGED');
		}

		setInfo(info) {
			this.gameId = info.gameId;
			this.gameState = info.gameState;
			this.bankroll = info.bankroll;
			this.playing = new Map(Object.entries(info.playing));
			this.cashOuts = info.cashOuts;
			this.history = info.history;

			console.assert(Number.isFinite(info.elapsed));
			this.startTime = Date.now() - info.elapsed;

			this.emit('GAME_STATE_CHANGED');
			this.emit('BANKROLL_CHANGED');
			this.emit('PLAYERS_CHANGED');
			this.emit('BET_STATUS_CHANGED');
			this.emit('HISTORY_CHANGED');
		}
}



// our great singleton
let engine = new Engine(); // should be 'const' but webstorm thinks it's a mistake




socket.on('gameStarting', info => {
	engine.gameId = info.gameId;
  engine.playing = new Map();
	engine.cashOuts = [];

	engine.wager = 0;
	engine.cashedAt = 0;

  engine.gameState = 'GAME_STARTING';

  const timeTillStart = 5000; // TODO: this should be sent by the server?

  engine.startTime = Date.now() + timeTillStart;
  engine.maxWin = info.maxWin;
  
  // Every time a game is starting, we check if there's a queued bet
  if (engine.nextWager) {
		socket.send('bet', {
			wager: engine.nextWager,
			payout: engine.nextPayout
		});
		engine.nextWager = null;
		engine.nextPayout = null;
	}

	engine.emit('PLAYERS_CHANGED');
	engine.emit('GAME_STATE_CHANGED');
});

socket.on('gameStarted', () => {
  engine.gameState = 'GAME_IN_PROGRESS';
  engine.startTime = Date.now();
  engine.lastGameTick = engine.startTime;
  engine.placingBet = false;


  engine.emit('GAME_STATE_CHANGED');
	engine.emit('PLAYERS_CHANGED'); // Not quite sure this is required
});


socket.on('gameEnded', info => {
  engine.gameState = 'GAME_ENDED';
  engine.bust = info.bust;
  engine.forced = info.forced;
  engine.lastHash = info.hash;

  // TODO: .... handle bankroll info..


	engine.history.push({
		gameId: engine.gameId,
		bust: engine.bust,
		hash: info.hash,
		cashedAt: engine.cashedAt,
		wager: engine.wager,
	});

	if (engine.history.length > 100) {
		engine.history.shift()
	}

	engine.emit('HISTORY_CHANGED');
	engine.emit('GAME_STATE_CHANGED');
	engine.emit('PLAYERS_CHANGED');
});

socket.on('gameStopped', () => {
	engine.gameState = 'GAME_STOPPED';
	engine.emit('GAME_STATE_CHANGED');
});


socket.on('betPlaced', bet => {

	engine.playing.set(bet.uname, bet.wager);

	if (bet.uname === userInfo.uname) {
		engine.placingBet = false;
		engine.wager = bet.wager;


		userInfo.changeBalanceFromBet(bet.wager);
		engine.emit('BET_STATUS_CHANGED');
	}

	engine.emit('PLAYERS_CHANGED');
});


socket.on('cashedOut', function(cashOuts) {
	let changeBalance = 0;

	for (const [cashedAt, ...unames] of cashOuts) {

		for (const uname of unames) {
			const wager = engine.playing.get(uname);

			engine.playing.delete(uname);
			engine.cashOuts.push({ uname, cashedAt, wager });


			if (uname === userInfo.uname) {
				engine.cashingOut = false;
				engine.cashedAt = cashedAt;

				// We should emit bet_status_changed, but let's do that at the end
				// we will change changeBalance so we know
				changeBalance = wager * cashedAt;
			}
		}

	}

	if (changeBalance !== 0) {
		userInfo.changeBalance(changeBalance);
		engine.emit('BET_STATUS_CHANGED');
	}

	engine.emit('PLAYERS_CHANGED');
});


// ---


// we invested,
socket.on('youInvested', amount => {

	const { stake } = userInfo;
	const { bankroll } = engine;

	let scaler = 1 - dilutionFee;
	let newStake = (scaler * amount + stake * bankroll) / (bankroll + scaler * amount);

	engine.bankroll += amount;
	engine.invested += amount;

	engine.emit('BANKROLL_CHANGED');
	userInfo.invest(amount, newStake);
});

// someone else invested
socket.on('invested', amount => {
	engine.bankroll += amount;
	engine.invested += amount;
	engine.emit('BANKROLL_CHANGED');
});


// we divested
socket.on('youDivested', divested => {
	const { stake } = userInfo;
	const { bankroll } = engine;

	const total = divested.balance + divested.silver;
	const newBankroll = bankroll - total;

	let newStake = newBankroll > 0 ? (stake * bankroll - total) / newBankroll : 0;

	engine.bankroll -= total;
	engine.divested += total;
	engine.emit('BANKROLL_CHANGED');
	userInfo.divest(divested.balance, divested.silver, newStake);
});




socket.on('connect', ([loggedIn, engineInfo, friendsInfo]) => {

	if (loggedIn) {
		userInfo.logIn(loggedIn.userInfo);
	}

	engine.setInfo(engineInfo);
	chat.initializeFriends(friendsInfo);


});



window._engine = engine; // for debugging:

export default engine;

