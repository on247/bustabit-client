import React, { PureComponent } from 'react'
import { Col, Form } from 'react-bootstrap'
import { Link, browserHistory } from 'react-router';
import socket from '../../socket'
import refresher from '../../refresher';
import NotLoggedIn from '../not-logged-in-well'
import userInfo from '../../core/userInfo'
import { formatBalance } from '../../util/belt'
import {processWithdrawalsFee} from '../../util/config'
import confirm from '../../util/confirmation'
import notification from '../../core/notification'

class QueuedWithdrawals extends PureComponent {

  constructor() {
    super();
    this.state = {
      error: null,
			submitting: false
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    const confirmMessage = 'Are you sure you want to process the queued withdrawals for a fee of '
      + formatBalance(processWithdrawalsFee) +' bits ?';
		this.setState({ submitting: true, touched: true });
    confirm(confirmMessage).then(
        (result) => {
          // `proceed` callback
          // console.log('proceed called');
          console.log(result);
          socket.send('sendWithdrawals')
            .then(() => {
								this.setState({ submitting: false});
                console.log('Queued withdrawals will be processed.');
                browserHistory.push('/');
                notification.setMessage('Queued withdrawals will be processed.');
              },
              err => {
								this.setState({ submitting: false});
								if (err === 'INSUFFICIENT_BALANCE') {
									console.error('Unexpected server error: ' + err);
									notification.setMessage(<span><span className="red-tag">Error </span> You don't have enough balance.</span>, 'error');
								} else
                console.error('Unexpected server error: ' + err);
                notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
              }
            )
        },
        (result) => {
          // `cancel` callback
          // console.log('cancel called');
          console.log(result)
					this.setState({ submitting: false});
        }
      )

  }

  render() {

    if (!userInfo.uname) {
      return (
        <NotLoggedIn/>
      )
    }
    return (
      <Col xs={24}>
        <Col sm={18} xs={12} style={{marginTop: '20px'}}>
          <h4 style={{textTransform: 'uppercase', letterSpacing: '3px'}}>Process Withdrawals</h4>
        </Col>
        <Col sm={6} xs={12} style={{marginTop: '20px'}}>

        </Col>
        <Col xs={24} style={{marginTop: '10px'}}>
          <p>
            For privacy and efficiency, Bustabit groups all withdrawals into batches,
            and they take some time to be processed, and actually be sent to your bitcoin address as requested.
          </p>
          <p>
            However, we recognize some people need the bitcoin immediately, so we offer the option to expedite the process by clicking this button and paying a fee of {formatBalance(processWithdrawalsFee)} bits.
          </p>
        </Col>
        <Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
          <button className='btn btn-warning btn-lg' type="submit"
									disabled={ this.state.submitting }>
						{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Process Withdrawals'}
					</button>
          </Form>
        </Col>
        <Col xs={24}>
          <p className="text-muted" style={{alignSelf: 'flex-start'}}>
            If you want to check your past withdrawals and their status:
            <span style={{marginLeft: '5px'}}>
            <Link className="btn btn-info btn-xs" to="/transactions/withdrawals">
              <i className="fa fa-history"></i> History</Link>
          </span>
          </p>
        </Col>
      </Col>
    )
  }
}


export default refresher(QueuedWithdrawals,
  [userInfo, 'UNAME_CHANGED']
);