import React, { PureComponent } from 'react'
import {  Col, Row } from 'react-bootstrap'
import { Link } from 'react-router';

class FaqMenu extends PureComponent {

  render() {

    return (
      <Row>
        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Basics</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/faq/what-is-bustabit">What is Bustabit?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/how-to-play">How to play?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/what-is-a-bit">What is a bit?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/what-is-silver">What is silver?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/what-is-valor">What is valor?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/house-edge">What is the house edge?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/gross-profit">What is gross profit?</Link>
            </li>
          </ul>
        </Col>
        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Deposits</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/faq/how-to-deposit">How do I deposit bits?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/how-long-is-the-deposit-address-valid">How long is the deposit address valid?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/how-long-do-deposits-take">How long do deposits take to be credited?</Link>
            </li>
          </ul>
        </Col>

        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Game</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/faq/what-happens-if-disconnected">What happens if I disconnect from the game?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/how-high-can-the-game-go">How high can the game go?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/max-bet">What is the most I can bet?</Link>
            </li>
          </ul>
        </Col>

        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Withdrawals</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/faq/how-to-withdraw">How do I withdraw bits?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/withdrawal-fee">What's the withdrawal fee?</Link>
            </li>
          </ul>
        </Col>

        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Transactions</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/faq/how-to-trade">How can I trade in game?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/how-to-tip">How can I tip someone?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/tip-fee">What is the tip fee?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/faucet">How can I get free bits from the faucet?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/how-to-fuse">How can I fuse valor with silver?</Link>
            </li>
          </ul>
        </Col>


        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Fairness</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/faq/game-odds">What are the game odds?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/bust-calculation">How is the game bust calculated?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/is-the-game-fair">Is the game fair?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/how-to-verify-game-results">How to verify the game results?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/forced-cash-out">What happens when the server forces people to cash out?</Link>
            </li>
          </ul>
        </Col>
        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Chat</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/faq/chat-commands">What are the commands I can use in the chat?</Link>
            </li>
          </ul>
        </Col>

        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Bankroll</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/faq/how-does-the-bankroll-work">How does the bankroll work?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/bankroll-potential-profit">What is my potential profit?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/bankroll-potential-risk">What's the risk of being part of the bankroll? Can I lose money?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/new-bankroller-fee">What is the new bankroller fee?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/bankroll-commission">How much does it cost to withdraw profits from the bankroll?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/how-can-i-contribute-as-bankroller">How can I contribute to the growth of the site as a bankroller?</Link>
            </li>
          </ul>
        </Col>

        <Col sm={24} xs={24} style={{marginTop: '20px'}}>
          <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Other</h5>
          <ul className="nav nav-pills nav-stacked">
            <li role="presentation">
              <Link to="/faq/support">How can I get support or contact Bustabit team?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/bug-bounty">Do you have a bug bounty program?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/mobile-app">Do you have a mobile app for Iphone or Android?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/other-gambling-recommendations">What other gambling places do you recommend?</Link>
            </li>
            <li role="presentation">
              <Link to="/faq/gambling-addiction">Do you have gambling addiction?</Link>
            </li>
          </ul>
        </Col>
      </Row>
    )
  }
}




export default FaqMenu;
