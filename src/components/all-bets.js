import React, { PropTypes, PureComponent } from 'react';
import { floorTo } from '../util/math'
import CSSTransitionGroup from 'react-addons-css-transition-group';


export default class AllBets extends PureComponent {



  tableRows() {
    return this.props.bets.map(bet =>

      <div className="row" key={ 'bet-' + bet.id }>
        <div className="col-xs-2 text-right">{ floorTo(bet.wager/100, -2) }</div>
        <div className="col-xs-3 text-right">{ bet.payout }x</div>
        <div className="col-xs-4 text-right">{ floorTo(bet.outcome, -2) }x</div>
        <div className="col-xs-3 text-right">{
            Math.floor(bet.outcome > bet.payout ? (bet.payout - 1) * bet.wager : -bet.wager) / 100
            }
            </div>
      </div>

    );
  }

  render() {

    const styles= {
      thead: {
        //backgroundColor: '#3498db'
        borderBottom: '3px solid #f2f2f2',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }
    };

    return (
      <div>
        <div className="row text-center" style={styles.thead}>
          <div className="col-xs-2">
            <p>Bet</p>
          </div>
          <div className="col-xs-3">
            <p>Payout</p>
          </div>
          <div className="col-xs-4">
            <p>Outcome</p>
          </div>
          <div className="col-xs-3">
            <p>Profit</p>
          </div>
        </div>
        <div>
          <CSSTransitionGroup transitionName="example"
                              transitionEnter={this.props.newBets}
                              transitionEnterTimeout={5000}
                              transitionLeave={false}
                              transitionAppear={false}
                              transitionAppearTimeout={2000}
                              >
            { this.tableRows() }

            </CSSTransitionGroup>
        </div>
      </div>

    )
  }

}

AllBets.propTypes = {
  bets: PropTypes.array.isRequired
};
