import React, { PureComponent } from 'react'
import { Table, Col, FormGroup, Radio, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import OrderBookResults from './order-book-results'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';

class OrderBook extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			tradeOption: 'valorForBalance'
		};

		this.onChanged = this.onChanged.bind(this)
	}

	onChanged(event) {
		this.setState({ tradeOption: event.target.value });
	}


	render() {
		const { tradeOption } = this.state;

		return (
			<Row>
				<Col sm={20} xs={24} style={{marginTop: '20px'}}>
					<FormGroup style={{ margin: 0}}>
						<Col sm={8} xs={24}>
							<Table>
								<tbody>
								<tr>
									<td colSpan="2" style={{letterSpacing: '2px', textTransform: 'uppercase', textAlign:'center'}}>
										Bits for:
									</td>
								</tr>
								<tr>
									<td>
										<Radio name="tradeOptions" value="balanceForValor" onChange={ this.onChanged } checked={ tradeOption === 'balanceForValor'} >
											Valor
										</Radio>
									</td>
									<td>
										<Radio name="tradeOptions" value="balanceForSilver" onChange={ this.onChanged} checked={ tradeOption === 'balanceForSilver'}>
											Silver
										</Radio>
									</td>
								</tr>
								</tbody>
							</Table>
						</Col>
						<Col sm={8} xs={24}>
							<Table>
								<tbody>
								<tr>
									<td colSpan="2" style={{letterSpacing: '2px', textTransform: 'uppercase', textAlign:'center'}}>
										Valor for:
									</td>
								</tr>
								<tr>
									<td>
										<Radio name="tradeOptions" value="valorForBalance" onChange={ this.onChanged } checked={ tradeOption === 'valorForBalance'}>
											Bits
										</Radio>
									</td>
									<td>
										<Radio name="tradeOptions" value="valorForSilver" onChange={ this.onChanged } checked={ tradeOption === 'valorForSilver'}>
											Silver
										</Radio>
									</td>
								</tr>
								</tbody>
							</Table>
						</Col>
						<Col sm={8} xs={24}>
							<Table>
								<tbody>
								<tr>
									<td colSpan="2" style={{letterSpacing: '2px', textTransform: 'uppercase', textAlign:'center'}}>
										Silver for:
									</td>
								</tr>
								<tr>
									<td>
										<Radio name="tradeOptions" value="silverForBalance" onChange={ this.onChanged } checked={ tradeOption === 'silverForBalance'}>
											Bits
										</Radio>
									</td>
									<td>
										<Radio name="tradeOptions" value="silverForValor" onChange={ this.onChanged } checked={ tradeOption === 'silverForValor'}>
											Valor
										</Radio>
									</td>
								</tr>
								</tbody>
							</Table>
						</Col>
					</FormGroup>
				</Col>
				<Col xs={24} sm={20}>
					<Table striped bordered condensed hover responsive>
						<thead className="table-header">
						<tr>
							<th>User</th>
							<th>Offering</th>
							<th>Asking for</th>
							<th>Rate</th>
							<th></th>
						</tr>
						</thead>
						<OrderBookResults tradeOption={this.state.tradeOption} />
					</Table>
				</Col>
				<Col xs={24} sm={20}>
					<p className="text-muted" style={{alignSelf: 'flex-start'}}>
						<span className="hl-word">Hint: </span> Read more about <Link to="/faq/how-to-trade">trades</Link>.</p>
				</Col>
			</Row>
		);
	}
}


export default refresher(OrderBook,
	[userInfo, 'UNAME_CHANGED']
);