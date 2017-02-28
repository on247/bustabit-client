import React, { PureComponent } from 'react'
import { Col, Table, Row } from 'react-bootstrap'
import { Link } from 'react-router';
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';
import socket from '../../socket'
import { formatBalance } from '../../util/belt'


class TipHistory extends PureComponent {

	constructor() {
		super();
		this.init = this.init.bind(this);
		this.unmounted = false;
		this.state = {
			loading: true,
			error: null,
			tips: []  // an object of { amount, created, currency, fee, id, toUname, uname }
		}
	}

	componentWillMount() {
		this.init();
		socket.on('tipped', this.init);
	}

	componentWillUnmount() {
		socket.removeListener('tipped', this.init);
		this.unmounted = true;
	}

	init() {
		socket.send('getTipHistory')
			.then(tips => {
				if (this.unmounted) return;
				this.setState({ tips, loading: false })
			})
			.catch(error => {
				console.error('Got an error from the server when requesting tip history: ', error);
				if (this.unmounted) return;
				this.setState({ error, loading: false })
			});
	}

	results() {
		console.log('The tip history is: ',this.state.tips);
		return this.state.tips.map(d => <tr key={ d.id }>
			<td>{ d.created }</td>
			<td>{ d.uname }</td>
			<td>{ d.toUname }</td>
			<td>{ d.currency === "BALANCE" ? formatBalance(d.amount)+' bits'
				: formatBalance(d.amount) +' '+ d.currency.toLowerCase()}</td>
		</tr>);
	}



  render() {

    return (
      <Row>
        <Col sm={18} xs={12} style={{marginTop: '20px'}}>
          <h4 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Tips</h4>
        </Col>
        <Col sm={6} xs={12}  style={{marginTop: '20px'}}>
          <Link className="btn btn-info" to="/tip"><i className="fa fa-gift"></i> Tip Someone</Link>
        </Col>
        <Col xs={24} style={{marginTop: '10px'}}>
          <p>Tips are deposits other players make into your account. You can make friends in Bustabit and ask for tips in the Spam Chat Channel.</p>
          <br/>

          <Table striped bordered condensed hover responsive className="history-table">
            <thead className="table-header">
            <tr>
              <th>Created</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
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



export default refresher(TipHistory,
	[userInfo, 'UNAME_CHANGED']
);

