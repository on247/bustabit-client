import React, { PureComponent } from 'react'
import { Table , Col, Row } from 'react-bootstrap'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';
import socket from '../../socket'
import { formatBalance, formatCurrency } from '../../util/belt'

class MyTrades extends PureComponent {
	constructor() {
		super();
		this.init = this.init.bind(this);
		this.unmounted = false;
		this.state = {
			loading: true,
			error: null,
			trades: []  // an object of { 	fulfilledUname, askAmount, askCurrency, created, fee, id, offerAmount, offerCurrency, status, uname }
		}
	}
	componentWillMount() {
		this.init();
		socket.on('traded', this.init);
	}

	componentWillUnmount() {
		socket.removeListener('traded', this.init);
		this.unmounted = true;
	}

	init() {
		socket.send('getTradeHistory')
			.then(trades => {
				if (this.unmounted) return;
				this.setState({ trades, loading: false })
			})
			.catch(error => {
				console.error('Got an error from the server when requesting trade history: ', error);
				if (this.unmounted) return;
				this.setState({ error, loading: false })
			});
	}

	results() {
		console.log('The trade history is: ',this.state.trades);
		return this.state.trades.map(d => <tr key={ d.id }>
			<td>{ d.created }</td>
			<td>{ formatBalance(d.offerAmount) +' '+ formatCurrency(d.offerCurrency) }</td>
			<td>{ formatBalance(d.askAmount) +' '+ formatCurrency(d.askCurrency) }</td>
			<td>{ d.status }</td>
			<td className="text-center">{ d.status === "OPEN" ? <button className="btn btn-xs btn-danger">Cancel</button> : '' }</td>
		</tr>);
	}
    render() {
        return (
            <Row>
                <Col sm={18} xs={12} style={{marginTop: '20px'}}>
                    <h4 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Trades</h4>
                </Col>
                <Col xs={24} style={{marginTop: '10px'}}>
                    <p>Trades are transactions between in-game players.</p>
                    <br/>
                    <Table striped bordered condensed hover responsive className="history-table">
                        <thead className="table-header">
                        <tr>
                            <th>Created</th>
                            <th>Offer</th>
                            <th>For</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
												{ this.results() }
												</tbody>
                    </Table>
                </Col>
            </Row>

        )
    }
}


export default refresher(MyTrades,
	[userInfo, 'UNAME_CHANGED']
);

