import React, { PureComponent } from 'react'
import { Col, Table, Row } from 'react-bootstrap'
import { Link } from 'react-router';
import { formatBalance } from '../../util/belt'
import {  blockExplorerUrlPrefix } from '../../util/config'
import socket from '../../socket'


export default class DepositHistory extends PureComponent {

	constructor() {
		super();
		this.init = this.init.bind(this);
		this.unmounted = false;
		this.state = {
			loading: true,
			error: null,
			deposits: []  // an object of { 	address, txid, vout, amount, status, created }
		}
	}

	componentWillMount() {
		this.init();
		socket.on('deposit', this.init);
	}

	componentWillUnmount() {
		socket.removeListener('deposit', this.init);
		this.unmounted = true;

	}


	init() {
		socket.send('getDepositHistory')
			.then(deposits => {
				if (this.unmounted) return;
				this.setState({ deposits, loading: false })
			})
			.catch(error => {
				console.error('Got an error from the server when requesting deposits: ', error);
				if (this.unmounted) return;
				this.setState({ error, loading: false })
			});
	}



	getStatus(deposit) {
		if (deposit.status === 'PENDING' && deposit.precredited) {
			return 'PRECREDITED'
		}
		return deposit.status;
	}

	getExtra(deposit) {
		if (deposit.status === 'PENDING' && !deposit.precredited) {
			return <button className="btn btn-primary" onClick={ () => socket.send('precreditDeposit', deposit.id) }>Attempt precredit (1% fee)!</button>
		}
		if (deposit.fee) {
			return <small>precredit-fee: {formatBalance(deposit.fee)} bits</small>
		}
		return ''
	}


	results() {
		return this.state.deposits.map(d => <tr key={ d.txid + ':' + d.vout }>
			<td>{ d.address }</td>
			<td>{ formatBalance(d.amount) } bits</td>
			<td>
				<a href={ blockExplorerUrlPrefix + d.txid + '/#output-index-' + d.vout} target="_blank" rel="noopener">
				{ this.getStatus(d) }
				</a>
			</td>
			<td>{ this.getExtra(d) }</td>
		</tr>);
	}



	render() {
    return (
      <Row>
        <Col sm={18} xs={12} style={{marginTop: '20px'}}>
          <h4 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Deposits</h4>
        </Col>
        <Col sm={6} xs={12}  style={{marginTop: '20px'}}>
          <Link className="btn btn-info" to="/deposit"><i className="fa fa-arrow-circle-right"></i> Make a Deposit</Link>
        </Col>
        <Col xs={24} style={{marginTop: '10px'}}>

          <Table striped bordered condensed hover responsive className="history-table">
            <thead className="table-header">
            <tr>
              <th>Deposit Address</th>
              <th>Amount</th>
              <th>Status</th>
							<th></th>
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

