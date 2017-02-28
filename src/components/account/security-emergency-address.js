import React, { Component } from 'react'
import { Row, Form, FormGroup, Col, InputGroup } from 'react-bootstrap'

import socket from '../../socket'
import { browserHistory } from 'react-router'
import userInfo from '../../core/userInfo';
import refresher from '../../refresher';
import notification from '../../core/notification'

function validateAddress(address) {
  if (!address)
    return 'Please enter your bitcoin address.';
  if (address.length < 10 )
    return 'This doesn\'t look like a bitcoin address';
}

class EmergencyAddress extends Component {
  constructor(props) {
    super(props);
		this.firstInput = null; // this is a ref
    this.state = {
      address: userInfo.emergencyWithdrawalAddress || '',
      error: null,
      addressError: null,
			submitting: false,
			touched: false
    };
  }
	componentDidMount(){
		this.firstInput.focus();
	}
  // this returns true if the form is valid
  validate(values) {
    const addressError = validateAddress(values.address);
    this.setState({
      addressError
    });
    return !addressError;
  }
  onAddressChange(event) {
    const address = event.target.value;
    const addressError = this.state.touched ? validateAddress(address) : null;
    this.setState({address, addressError});
  }
  handleSubmit(event) {
    event.preventDefault();
    let {address} = this.state;
    if (!this.validate(this.state)) {
      console.warn('submitted while not valid');
      return
    }
    this.setState({submitting: true, touched: true});
    socket.send('updateEmergencyWithdrawalAddress', address)
      .then(info => {
        console.log(info);
				this.setState({ submitting: false});
        browserHistory.push('/');
        notification.setMessage(<span><span className="green-tag">Success!</span> An emergency bitcoin address has been enabled for your account.</span>);
      }, err => {
				this.setState({ submitting: false});
          console.error('Unexpected server error: ' + err);
          notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
          this.setState({
            passcodeError: err
          });
      })
  }

  render() {
    const { addressError }  = this.state;

    return (
      <Row>
          <Col sm={24} xs={24} style={{marginTop: '20px'}}>
            <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Emergency Data</h5>
            <p>
              <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold'}}>Optional:</span> Provide your bitcoin address in case that we have to send your balance.
            </p>
          </Col>
        <Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
          <Col xs={16} xsOffset={4}>
            { addressError && <strong className="red-error">{addressError}</strong>}
            <FormGroup className={addressError ? 'has-error' : ''}>
              <InputGroup>
                <InputGroup.Addon>
                  Bitcoin Address:
                </InputGroup.Addon>
                <input type="text"
                       placeholder="Bitcoin Address"
                       name="address"
                       className="form-control"
                       value={this.state.address}
                       ref={(input) => { this.firstInput = input; }}
                       onChange={(event) => this.onAddressChange(event)}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <button className='btn btn-success btn-lg' type="submit" disabled={ this.state.submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
            </button>
          </Col>
        </Form>
      </Row>

    )
  }
}


export default refresher(EmergencyAddress,
	[userInfo, 'UNAME_CHANGED', 'EMERGENCY_WITHDRAWAL_ADDRESS_CHANGED']
);