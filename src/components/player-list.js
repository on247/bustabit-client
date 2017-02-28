import React, { Component } from 'react';
import { Table } from 'react-bootstrap'
import PlayerListContents from './player-list-contents'


class PlayerList extends Component {


	render() {


		return (
				<Table striped bordered condensed hover className="playerlist-table">
					<thead className="table-header">
					<tr>
						<th>User</th>
						<th>@</th>
						<th>Bet</th>
						<th>Profit</th>
					</tr>
					</thead>
					<PlayerListContents />
				</Table>
		)
	}

}

export default PlayerList;