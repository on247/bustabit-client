import EventEmitter from 'events';

// events:
//  WIDTH_CHANGED:  Window width changed
//  HEIGHT_CHANGED:  Window height changes


class BrowserSize extends EventEmitter {

	constructor() {
		super();
		this.setMaxListeners(100);

		this.width = browserWidth();
		this.height = browserHeight();

		// Note: this leaks badly. However since BrowserSize is going to be a singleton, it doesn't matter..
		window.addEventListener("resize", () => {
			const oldWidth = this.width;
			const oldHeight = this.height;

			this.width = browserWidth();
			this.height = browserHeight();


			if (oldWidth !== this.width)
				this.emit('WIDTH_CHANGED');

			if (oldHeight !== this.height)
				this.emit('HEIGHT_CHANGED');

		});
	}
	isMobile() {
     return this.width < 992
	}

	topBarHeight() {
		return this.isMobile() ? 42 : 52
	}

	marginsHeight() {
		return this.isMobile() ? 10 : 30
	}

	graphicDisplayHeight() {
		return this.isMobile() ? 0.2 : 0.45
	}

  betControlsHeight() {
    return this.isMobile() ? 0.25 : 0.45
  }

  bottomWidgetHeight() {
		return this.isMobile() ? 0.55 : 0.55
	}

	previousCrashesHeight() {
    return this.isMobile() ? 33 : 32
	}

	addChatHeight() {
    return this.isMobile() ? 34 : 34
	}
}

function browserWidth() {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function browserHeight() {
	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

let browserSize = new BrowserSize();

window._browserSize = browserSize; // for debugging:

export default browserSize;