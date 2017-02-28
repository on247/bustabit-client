import React, { Component, PropTypes } from 'react'

import '../sass/app.css';
import '../../node_modules/font-awesome/css/font-awesome.css'
import TopBar from '../components/menus/top-bar'
import SwitchableAreaContainer from '../components/chat/switchable-area-container'
import BetControls from '../components/bet-controls'
import VerticalMenu from '../components/menus/vertical-menu'
import PlayerList from '../components/player-list'
import GraphicDisplay from '../components/graphic-display'
import Notification from '../components/notification'
import browserSize from '../core/browser-size'
import refresher from '../refresher'

class App extends Component {

  render() {
    const { height } = browserSize;

    const styles = {
      mainContainer: {
        height: height + 'px',
        padding: browserSize.isMobile() ? '0px' : ' 0px 10px'
      },
      // Not shown in mobile
      sidebar: {
        height: ( height - browserSize.topBarHeight() ) + 'px',
      },
      graphicDisplay: {
        // Desktop: (height - [ topBar 52px + 30 margin] ) * 45%
        // Mobile: (height - [ topBar 43px + 10 margin] ) * 20%
        height: (height - (browserSize.topBarHeight() + browserSize.marginsHeight())) * browserSize.graphicDisplayHeight() +'px'
      },
      // Desktop: (height - [ topBar 52px + 30 margin] ) * 45%
      // Mobile: (height - [ topBar 43px + 10 margin] ) * 25%
      betControls: {
        height: (height - (browserSize.topBarHeight() + browserSize.marginsHeight())) * browserSize.betControlsHeight() +'px'

      },
      // Desktop: (height - [ topBar 52px + 30 margin] ) * 55%
      // Mobile: (height - [ topBar 43px + 10 margin] ) * 55%
      bottomWidget: {
        height: (height - (browserSize.topBarHeight() + browserSize.marginsHeight())) * browserSize.bottomWidgetHeight() +'px',
      },
      // Not shown in mobile
      playerList: {
        height: (height - (browserSize.topBarHeight() + (browserSize.marginsHeight() * 0.5 )))  +'px'
      }
    };

    return (
      <div className="container-fluid" style={styles.mainContainer}>
        <TopBar/>
        <Notification/>
        <div className="col-xs-24" style={{ display: 'flex'}}>
          <div className="row">
            {/* Sidebar */}
            { browserSize.isMobile() ? ''
              :
            <div className="col-md-1" style={styles.sidebar}>
              <VerticalMenu />
            </div>
            }
            {/* Left Panel */}
            <div className="col-md-15 col-sm-24 col-xs-24">
              <div className="row">
                {/* Game Display */}
                <div className="col-md-12 col-sm-24 col-xs-24" style={styles.graphicDisplay}>
                  <div className="component-box graphic-display" style={{ display: 'flex', alignItems: 'center'}}>
                    <GraphicDisplay />
                  </div>
                </div>
                {/* Game Controls */}
                <div className="col-md-12 col-sm-24 col-xs-24" style={styles.betControls}>
                  <div className="component-box bet-controls">
                    <BetControls/>
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Chat & History */}
                <div className="col-xs-24" style={styles.bottomWidget}>
                        <SwitchableAreaContainer />
                </div>
              </div>
            </div>{/* End of Left Panel */}

            {/* Right Panel */}
            { browserSize.isMobile() ? ''
              :
              <div className="col-md-8 col-sm-24 col-xs-24 margin-top-right-panel" style={styles.playerList}>
                <div className="component-box-row">
                  <PlayerList/>
                </div>
              </div>
            }
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }

}

App.propTypes = {
	children: PropTypes.node,
}

export default refresher(App,
  [browserSize, 'HEIGHT_CHANGED', 'WIDTH_CHANGED']
);
