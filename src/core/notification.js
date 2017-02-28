import EventEmitter from 'events';

// events:
//  CHANGE:  Whenever something changes.


class Notification extends EventEmitter {

  constructor() {
    super();
		this.setMaxListeners(100);
    this.message = null;
    this.type = 'default';
  }

  isActive() {
    return !!this.message;
  }

  getMessage() {
    return this.message || '';
  }

  // type can be 'default' or 'error'
  setMessage(message, type) {
    this.message = message;
    this.type = type || 'default';
    this.emit('CHANGE');
  }

  clearMessage() {
    console.log('Close clicked');
    this.setMessage(null);
  }



}

let notification = new Notification();

window._notification = notification; // for debugging:

export default notification;