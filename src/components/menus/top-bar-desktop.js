import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { Navbar, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Balance from '../balance'
import userInfo from '../../core/userInfo'
import refresher from '../../refresher';


class TopBarDesktop extends PureComponent {


	render() {

		const styles = {
			navItem: {
				padding: '15px 8px',
				textDecoration: 'none',
				textTransform: 'uppercase',
				letterSpacing: '2px',
				fontSize: '12px'
			},
			icon: {
				fontSize: '1.6rem'
			},
			logo: {
				width: '40px',
				float: 'left',
				marginRight: '10px',
				marginTop: '4px'
			},
			navbarBrand: {
				letterSpacing: '5px',
				textTransform: 'lowercase',
				fontSize: '2.5rem',
				fontWeight: 600,
				fontFamily: 'Courier New, sans-serif',
				marginRight: '10px'
			}
		};

    const tooltipFaucet = (
			<Tooltip id="tooltipFaucet"><strong>Faucet</strong></Tooltip>
    );

		let navBarUser = '';

		if (userInfo.uname) {
			navBarUser = (
				<ul className="nav navbar-nav navbar-right">
					<li>
						<Link to="/account/overview" style={styles.navItem}>
							<i className="fa fa-user" aria-hidden="true"></i> <b>{userInfo.uname}</b>
						</Link>
					</li>
					<li>
						<Link to="/account/stats" style={styles.navItem}>
							<Balance />
						</Link>
					</li>
					<li>
						<Link to="/logout" style={styles.navItem}>
							<i className="fa fa-power-off" aria-hidden="true"></i>
						</Link>
					</li>
				</ul>
			)
		} else {
			navBarUser = (
				<ul className="nav navbar-nav navbar-right">
					<li><Link to="/login"><b>Login</b></Link></li>
					<li><Link to="/register">Register</Link></li>
				</ul>
			)
		}

		const navbarInstance = (
			<Navbar fluid>
				<Navbar.Header>
					<img src={ require('../../../img/logo.png') } alt="Bustabit Logo" style={styles.logo}/>
					<Navbar.Brand>
						<Link to="/" style={styles.navbarBrand}>Bustabit</Link>
					</Navbar.Brand>
					<Navbar.Toggle />
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
              <OverlayTrigger placement="right" overlay={tooltipFaucet}>
                <Link to="/faucet" style={styles.navItem}>
                  <i className="fa fa-shower" style={styles.icon}></i>
                </Link>
              </OverlayTrigger>
						</li>

					</ul>
					{ navBarUser }
				</Navbar.Collapse>
			</Navbar>
		);

		return (
			<div>
				{ navbarInstance }
			</div>
		)
	}

}

export default refresher(TopBarDesktop,
	[userInfo, 'UNAME_CHANGED', 'BALANCE_CHANGED']
);

