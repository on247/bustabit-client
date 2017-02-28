import React, { PureComponent } from 'react'
import { Link } from 'react-router';
import { Tooltip, OverlayTrigger } from 'react-bootstrap'


class VerticalMenu extends PureComponent {

  render() {

    const styles = {
      container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%'
      }
    };

    const tooltipAccount = (
      <Tooltip id="tooltipAccount"><strong>Account</strong></Tooltip>
    );
    const tooltipFair = (
      <Tooltip id="tooltipFair"><strong>Provably Fair</strong></Tooltip>
    );
    const tooltipBankroll = (
      <Tooltip id="tooltipBankroll"><strong>Bankroll</strong></Tooltip>
    );
    const tooltipTransactions = (
      <Tooltip id="tooltipTransactions"><strong>Transactions</strong></Tooltip>
    );
    const tooltipFaq = (
      <Tooltip id="tooltipFaq"><strong>Frequently Asked Questions</strong></Tooltip>
    );
    const tooltipSupport = (
      <Tooltip id="tooltipSupport"><strong>Support</strong></Tooltip>
    );
    const tooltipTradeCenter = (
        <Tooltip id="tooltipTradeCenter"><strong>Trade Center</strong></Tooltip>
    );


    return (
      <div style={styles.container}>
        <OverlayTrigger placement="right" overlay={tooltipAccount}>
          <Link to="/account/overview" className="vertical-icon" key="account">
          <i className="fa fa-user fa-2x"></i>
        </Link>
        </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={tooltipTransactions}>
          <Link to="/transactions/deposits" className="vertical-icon" key="transactions">
            <i className="fa fa-exchange fa-2x"></i>
          </Link>
        </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={tooltipBankroll}>
          <Link to="/bankroll/overview" className="vertical-icon" key="bankroll">
            <i className="fa fa-university fa-2x"></i>
          </Link>
        </OverlayTrigger>
          <OverlayTrigger placement="right" overlay={tooltipTradeCenter}>
              <Link to="/trade/order-book" className="vertical-icon" key="tradeCenter">
                  <i className="fa fa-handshake-o fa-2x"></i>
              </Link>
          </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={tooltipFair}>
          <Link to="/fair" className="vertical-icon" key="fair">
            <i className="fa fa-balance-scale fa-2x"></i>
          </Link>
        </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={tooltipFaq}>
          <Link to="/faq" className="vertical-icon" key="faq">
            <h5 style={{ fontWeight: 900, letterSpacing: '3px'}}>FAQ</h5>
          </Link>
        </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={tooltipSupport}>
          <Link to="/support" className="vertical-icon" key="support">
            <i className="fa fa-question-circle fa-2x"></i>
          </Link>
        </OverlayTrigger>
      </div>
    )
  }
}


export default VerticalMenu;