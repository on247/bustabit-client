import React, { Component } from 'react';
import { Link } from 'react-router'
import engine from '../core/engine'
import  refresher from '../refresher'
import { formatBalance } from '../util/belt'
import CopyableHash from './copyable-hash'

class BetHistory extends Component {

  render() {
    return (
          <tbody>
					{
						engine.history.map(item => <tr key={item.gameId}>
              <td><Link to={"/game/" +item.gameId}>{item.bust}x</Link></td>
								<td>{ item.cashedAt }</td>
								<td>{ formatBalance(item.wager) }</td>
								<td>{ formatBalance(item.wager * (item.cashedAt - 1)) }</td>
								<td>
									<CopyableHash hash={item.hash}/>
								</td>
							</tr>
						).reverse()
					}
          </tbody>
    )
  }

}



export default refresher(BetHistory,
	[engine, 'HISTORY_CHANGED']
);
