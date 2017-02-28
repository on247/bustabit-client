import React, { Component } from 'react'
import SwitchableArea from './switchable-area'
import PreviousCrashes from '../previous-crashes'
import ChatOrHistorySwitch from './chat-or-history-switch'
import VerticalSwitch from './vertical-switch'
import browserSize from '../../core/browser-size'
import refresher from '../../refresher'
import { Col } from 'react-bootstrap'

class SwitchableAreaContainer extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 'chat',
    };
  }


  onChange() {
  	const currentTab = this.getCurrentTab();
    if (currentTab === 'chat') {
      this.setState({currentTab: 'history'})
    } else {
      this.setState({currentTab: 'chat'})
    }
  }

  getCurrentTab() {
		if ((this.state.currentTab === 'autoBet' || this.state.currentTab === 'players') && !browserSize.isMobile() ) {
			return 'chat';
		}
		return this.state.currentTab;
			}

  render() {

    if ( browserSize.isMobile() ) {
      return (
        <div className="component-box-bottom">
          <PreviousCrashes/>
          <Col xs={2} style={{width: '34px',padding: '0px'}}>
              <VerticalSwitch
                currentTab={this.state.currentTab}
                changeCurrentTab={(currentTab) => this.setState({currentTab})}
              />
          </Col>
          <Col xs={22} style={{padding: '0px', width: 'calc(100% - 34px'}}>
            <SwitchableArea
              currentTab={this.state.currentTab}
            />
          </Col>
        </div>
      );
    } else {
      return (
        <div className="component-box-bottom">
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', minWidth: '115px', alignItems: 'center', justifyContent: 'center'}}>
              <ChatOrHistorySwitch
                currentTab={this.state.currentTab}
                onChange={() => this.onChange()}
              />
            </div>
            <div style={{width: '100%'}}>
              <PreviousCrashes/>
            </div>
          </div>

          <SwitchableArea
            currentTab={this.getCurrentTab()}
          />
        </div>
      );
    }
  }
}
export default refresher(SwitchableAreaContainer,
  [browserSize, 'WIDTH_CHANGED']
);


