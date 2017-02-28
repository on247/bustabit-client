import React, { PureComponent, PropTypes } from 'react'
import browserSize from '../../core/browser-size'
import refresher from '../../refresher'


class VerticalSwitch extends PureComponent {

  render() {
    //Height
    // Mobile: height of window minus [43px of the top bar +  margins in between objects 10px] multiplied by 55%. Minus previous crashes 33px + add chat 34px

    let tabsHeight = (((browserSize.height - (browserSize.topBarHeight()+browserSize.marginsHeight())) * browserSize.bottomWidgetHeight() ) - browserSize.previousCrashesHeight()) ;

    let containerHeight = (((browserSize.height - (browserSize.topBarHeight()+browserSize.marginsHeight())) * browserSize.bottomWidgetHeight() ) - browserSize.previousCrashesHeight()) ;

    const { currentTab, changeCurrentTab }  = this.props;
    return (
      <div style={{height: containerHeight + 'px'}}>
        <ul className="nav nav-tabs tabs-left" style={{height: tabsHeight + 'px'}}>
          <li onClick={ () => changeCurrentTab('chat') } className={ currentTab === 'chat' ? 'active' : ''}>
            <a>Chat</a>
          </li>
          <li onClick={() => changeCurrentTab('history')} className={ currentTab === 'history' ? 'active' : ''}>
            <a>History</a>
          </li>
          <li onClick={() => changeCurrentTab('players')} className={ currentTab === 'players' ? 'active' : ''}>
            <a>Players</a>
          </li>
          <li onClick={() => changeCurrentTab('autoBet')} className={ currentTab === 'autoBet' ? 'active' : ''}>
            <a>Auto</a>
          </li>
        </ul>
      </div>

    )
  }
}

VerticalSwitch.propTypes = {
	currentTab: PropTypes.string.isRequired,
	changeCurrentTab: PropTypes.func.isRequired
};

export default refresher(VerticalSwitch,
  [browserSize, 'HEIGHT_CHANGED', 'WIDTH_CHANGED']
)