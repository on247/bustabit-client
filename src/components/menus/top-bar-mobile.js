import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { Navbar } from 'react-bootstrap';
import Balance from '../balance'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';


class TopBarMobile extends PureComponent {


	render() {

		const styles = {
		  nav: {
		    margin: '0px'
      },
			navItem: {
				padding: '10px 4px',
				textDecoration: 'none',
				textTransform: 'uppercase',
				letterSpacing: '1px',
				fontSize: '12px'
			},
			icon: {
				fontSize: '1.6rem'
			},
			navbarBrand: {
				letterSpacing: '2px',
				fontSize: '3rem',
				fontWeight: 900,
				fontFamily: 'Courier New, sans-serif'
			},
      navBarUser: {
		    marginRight: '5px',
				marginTop: '0px',
				marginBottom: '0px'
      }
		};

		let navBarUser = '';

		if (userInfo.uname) {
			navBarUser = (
				<ul className="nav navbar-nav pull-right" style={styles.navBarUser}>
					<li className="navbar-text pull-left" style={styles.nav}>
						<Link to="/account/overview" style={styles.navItem}>
							<i className="fa fa-user" aria-hidden="true"></i> <b>{userInfo.uname}</b>
						</Link>
					</li>
					<li className="navbar-text pull-left" style={styles.nav}>
						<Link to="/account/stats" style={styles.navItem}>
							<Balance />
						</Link>
					</li>
				</ul>
			)
		} else {
			navBarUser = (
				<ul className="nav navbar-nav pull-right" style={styles.navBarUser}>
					<li className="navbar-text pull-left" style={styles.nav}>
            <Link to="/login" style={styles.navItem}><b>Login</b></Link>
          </li>
					<li className="navbar-text pull-left" style={styles.nav}>
            <Link to="/register" style={styles.navItem}>Register</Link>
          </li>
				</ul>
			)
		}

    let navbarInstance = '';
    if (userInfo.uname) {
      navbarInstance = (
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/" style={styles.navbarBrand}>BaB</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            { navBarUser }
          </Navbar.Header>
          <Navbar.Collapse>
            <ul className="nav navbar-nav">
              <li>
                <Link to="/deposit" style={styles.navItem}>
                  <i className="fa fa-sign-in" style={styles.icon}></i> Deposit
                </Link>
              </li>
              <li>
                <Link to="/withdraw" style={styles.navItem}>
                  <i className="fa fa-sign-out" style={styles.icon}></i> Withdraw
                </Link>
              </li>
              <li>
                <Link to="/faucet" style={styles.navItem}>
                  <i className="fa fa-shower" style={styles.icon}></i>
                  Faucet
                </Link>
              </li>
              <li>
                <Link to="/account/overview" style={styles.navItem}>
                  <i className="fa fa-user" aria-hidden="true"></i> Account
                </Link>
              </li>
              <li>
                <Link to="/transactions/deposits" style={styles.navItem}>
                  <i className="fa fa-exchange" aria-hidden="true"></i> Transactions
                </Link>
              </li>
              <li>
                <Link to="/bankroll/overview" style={styles.navItem}>
                  <i className="fa fa-university" aria-hidden="true"></i> Bankroll
                </Link>
              </li>
              <li>
                <Link to="/trade/order-book" style={styles.navItem}>
                  <i className="fa fa-handshake-o" aria-hidden="true"></i> Trade Center
                </Link>
              </li>
              <li>
                <Link to="/fair" style={styles.navItem}>
                  <i className="fa fa-balance-scale" aria-hidden="true"></i> Provably Fair
                </Link>
              </li>
              <li>
                <Link to="/faq" style={styles.navItem}>
                  F A Q
                </Link>
              </li>
              <li>
                <Link to="/support" style={styles.navItem}>
                  <i className="fa fa-question-circle" aria-hidden="true"></i> Support
                </Link>
              </li>
              <li>
                <Link to="/logout" style={styles.navItem}>
                  <i className="fa fa-power-off" aria-hidden="true"></i> Logout
                </Link>
              </li>
            </ul>
          </Navbar.Collapse>
        </Navbar>
      );
    } else {
      navbarInstance = (
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/" style={styles.navbarBrand}>BaB</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
            { navBarUser }
          </Navbar.Header>
          <Navbar.Collapse>
            <ul className="nav navbar-nav">
              <li>
                <Link to="/deposit" style={styles.navItem}>
                  <i className="fa fa-user" style={styles.icon}></i> Login
                </Link>
              </li>
              <li>
                <Link to="/withdraw" style={styles.navItem}>
                  <i className="fa fa-user-plus" style={styles.icon}></i> Register
                </Link>
              </li>
							<li>
								<Link to="/faq" style={styles.navItem}>
									F A Q
								</Link>
							</li>
							<li>
								<Link to="/support" style={styles.navItem}>
									<i className="fa fa-question-circle" aria-hidden="true"></i> Support
								</Link>
							</li>
            </ul>
          </Navbar.Collapse>
        </Navbar>
      );
    }

		return (
			<div>
				{ navbarInstance }
			</div>
		)
	}

}

export default refresher(TopBarMobile,
	[userInfo, 'UNAME_CHANGED', 'BALANCE_CHANGED']
);

