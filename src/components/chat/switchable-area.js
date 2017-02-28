import React, { Component, PropTypes } from 'react'
import Chat from './chat'
import { Table } from 'react-bootstrap'
import browserSize from '../../core/browser-size'


import BetHistory from '../bet-history'
import AddChannels from './add-channels'
import PlayerList from '../player-list'
import Autobet from '../autobet/autobet'
import chat from '../../core/chat'
import refresher from '../../refresher'


class SwitchableArea extends Component {

	betHistory() {
		if (this.props.currentTab !== 'history')
			return null;

		return (

				<Table striped bordered hover responsive condensed>
					<thead className="table-header">
					<tr>
						<th style={{width: '20%'}}>Bust</th>
						<th style={{width: '20%'}}>@</th>
						<th style={{width: '20%'}}>Bet</th>
						<th style={{width: '20%'}}>Profit</th>
						<th style={{width: '20%'}}>Hash</th>
					</tr>
					</thead>
						<BetHistory/>
					</Table>
		);
	}

  players() {
    if (this.props.currentTab !== 'players')
      return null;

    return (
			<PlayerList />
    );
  }

  autoBet() {
    if (this.props.currentTab !== 'autoBet')
      return null;

    return (
			<Autobet />
    );
  }

  chat() {
    if (this.props.currentTab !== 'chat')
      return null;

    return (
    	<div>
			<Chat />
    { chat.showAddChannels && <AddChannels /> }
			</div>
    );
	}



  render() {
    const { height } = browserSize;
//Height
// Desktop: [(height - [ topBar 52px + 30 margin] ) * 55%] - 32 previous crashes
// Mobile: [(height - [ topBar 43px + 10 margin] ) * 55% ] - 33 previous crashes
    let containerHeight = (((height - (browserSize.topBarHeight()+browserSize.marginsHeight()) ) * browserSize.bottomWidgetHeight()  ) - browserSize.previousCrashesHeight()) +'px';

    let overflowY = this.props.currentTab === 'chat' ? 'hidden' : 'scroll';

			return(
			<div>
				<div className="inner-container-bottom" style={{ height: containerHeight , overflowY, overflowX: 'hidden'}}>
					{ this.betHistory() }
					{ this.players() }
					{ this.autoBet() }
          { this.chat() }
				</div>
			</div>
			);

  }
}

SwitchableArea.propTypes = {
	currentTab: PropTypes.string.isRequired
};


export default refresher(SwitchableArea,
  [browserSize, 'HEIGHT_CHANGED', 'WIDTH_CHANGED'],
  [chat, 'SHOW_ADD_CHANNELS_CHANGED']
)