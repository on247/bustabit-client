import React, { PureComponent } from 'react'

// subscribe list is an array of
//  [eventEmitter, 'event1', ...otherEvents]


export default function refresher(WrappedComponent, ...subscribeList) {

	return class Refresher extends PureComponent {

		constructor(props) {
			super(props);
			this.rerender = this.rerender.bind(this);
			this.nonce = 1; // If the nonce is 0, the compontent is unmounting...
			this.unmounting = false;
		}

		rerender() {
			if (this.unmounting) return;

			++this.nonce;
			this.forceUpdate();
		}

		componentDidMount() {
			for (const [eventEmitter, ...events] of subscribeList) {
				for (const event of events) {
					eventEmitter.on(event, this.rerender);
				}
			}
		}

		componentWillUnmount() {
			this.unmounting = true; // Tell it we should never forceUpdate again

			for (const [eventEmitter, ...events] of subscribeList) {
				for (const event of events) {
					eventEmitter.removeListener(event, this.rerender);
				}
			}
		}

		render() {
			return <WrappedComponent _refreshedCount={this.nonce} {...this.props} />
		}

	};


}
