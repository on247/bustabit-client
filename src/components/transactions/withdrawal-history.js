import React, { PureComponent } from 'react'
import { Table, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router';
import { formatBalance } from '../../util/belt'
import {  blockExplorerUrlPrefix } from '../../util/config'
import socket from '../../socket'

class WithdrawalHistory extends PureComponent {

	constructor() {
		super();
		this.unmounted = false;
		this.state = {
			loading: true,
			error: null,
			withdrawals: []  // an object of { 	id, txid, address, amount, fee, created }
		}
	}

	componentWillMount() {
		socket.send('getWithdrawalHistory')
			.then(withdrawals => {
				if (this.unmounted) return;
				this.setState({ withdrawals, loading: false })
			})
			.catch(error => {
				console.error('Got an error from the server when requesting withdrawals: ', error);
				this.setState({ error, loading: false })
			});
	}

	componentWillUnmount() {
		this.unmounted = true;

	}


	results() {
		return this.state.withdrawals.map(w => <tr key={w.id}>
			<td>{w.address}</td>
			<td>{ formatBalance(w.amount) } bits</td>
			<td>{ formatBalance(w.fee) } bits</td>
			<td>
				{  w.txid ? <a href={ blockExplorerUrlPrefix + w.txid } target="_blank" rel="noopener">Sent</a> :
          <Link to="/queued-withdrawals">Queued</Link> }
			</td>
			<td>
				{ w.created }
			</td>
		</tr>);
	}


  render() {

// TODO: Not sure if we should display the total of deposits, and be able to filter by month.

    return (
      <Row>
        <Col sm={18} xs={12} style={{marginTop: '20px'}}>
          <h4 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Withdrawals</h4>
        </Col>
        <Col sm={6} xs={12}  style={{marginTop: '20px'}}>
          <Link className="btn btn-info" to="/withdraw"><i className="fa fa-arrow-circle-left"></i> Request a Withdrawal</Link>
        </Col>
        <Col xs={24} style={{marginTop: '10px'}}>

          <Table striped bordered condensed hover responsive className="history-table">
            <thead className="table-header">
            <tr>
              <th>Address</th>
              <th>Amount</th>
							<th>Fee</th>
              <th>Status</th>
							<th>Created</th>
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


export default WithdrawalHistory;