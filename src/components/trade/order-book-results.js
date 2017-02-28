import React, { PropTypes, PureComponent } from 'react'
import HitOrderButton from './hit-order-button'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';

import socket from '../../socket'

import { formatBalance } from '../../util/belt'


class OrderBookResults extends PureComponent {
	constructor(props) {
		super(props);
		this._unmounted = false;
		this.state = {
			offerCurrency: null,
			askCurrency: null,
			orders: [],
			loading: true,
			error: null,
		}
	}


	fetch(tradeOption) {
		const [offerCurrency, askCurrency] = tradeOption.split('For').map(x => x.toUpperCase());

		socket.send('fetchOrderBook', { offerCurrency, askCurrency })
		.then(orders => {

			if (this._unmounted) return;

			this.setState({
				loading: false,
				error: null,
				offerCurrency,
				askCurrency,
				orders
			})
		})
		.catch(err => {
			console.error('Fetch order book gave an error: ', err);

			if (this._unmounted) return;

			this.setState({
				loading: false,
				error: err
			});
		})

	}


	componentWillMount() {
		this.fetch(this.props.tradeOption);
	}


	componentWillReceiveProps(newProps) {
		this.fetch(newProps.tradeOption);
		this.setState({ loading: true });
	}


	render() {
		if (this.state.loading) {
			return <tbody>
				<tr>
					<td colSpan="6">Loading...</td>
				</tr>
			</tbody>
		}

		if (this.state.error) {
			return <tbody>
			<tr>
				<td colSpan="6">Got error: {this.state.error}</td>
			</tr>
			</tbody>
		}

		const { offerCurrency, askCurrency } = this.state;


		return <tbody>
		{
			this.state.orders.map(order => <tr key={order.id}>
					<td>{order.uname}</td>
					<td>{ formatBalance(order.offerAmount) } { offerCurrency }</td>
					<td>{ formatBalance(order.askAmount) } { askCurrency }</td>
					<td>{ order.askAmount / order.offerAmount } { askCurrency } / { offerCurrency }</td>
					<td>
						<HitOrderButton tradeId={order.id} isSelf={ userInfo.uname === order.uname } />
					</td>
				</tr>
			)
		}
		</tbody>;

	}

	componentWillUnmount() {
		this._unmounted = true;
	}
}

OrderBookResults.propTypes = {
	tradeOption: PropTypes.string.isRequired,
};



export default refresher(OrderBookResults,
	[userInfo, 'UNAME_CHANGED']
)
