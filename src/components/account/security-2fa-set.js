import React, { PureComponent } from 'react'
import { Row, Form, FormGroup, Col, InputGroup } from 'react-bootstrap'
import socket from '../../socket'
import userInfo from '../../core/userInfo';
import refresher from '../../refresher';
import notification from '../../core/notification'
import { browserHistory } from 'react-router'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode.react'
import { validatePasscode } from '../../util/belt'



class SetTwoFactorAuthentication extends PureComponent {
  constructor(props) {
    super(props);
		this.firstInput = null; // this is a ref
    this.state = {
      passcode: '',
      passcodeError: null,
      secret: speakeasy.generateSecret({length: 20}).base32,
      submitting: false,
			touched: false

		};
  }
	componentDidMount(){
		this.firstInput.focus();
	}
  validate(values) {
    const passcodeError = validatePasscode(values.passcode);
    this.setState({
      passcodeError
    });
    return !passcodeError;
  }

  onPasscodeChange(event) {
    const passcode = event.target.value;
    const passcodeError = this.state.touched ? validatePasscode(passcode) : null;
    this.setState({passcode, passcodeError});
  }

  handleSubmit(event) {
    event.preventDefault();
    let {secret, passcode} = this.state;
    if (!this.validate(this.state)) {
      console.warn('submitted while not valid');
      return
    }
    this.setState({submitting: true, touched: true});
    socket.send('setMFASecret', {secret, passcode})
      .then(info => {
        console.log(info);
				this.setState({ submitting: false });
        browserHistory.push('/');
        notification.setMessage(<span><span className="green-tag">Success!</span> Two Factor Authentication has been enabled for your account.</span>);
      }, err => {
				this.setState({ submitting: false });
        if (err === 'INVALID_PASSCODE') {
          this.setState({
            passcodeError: 'The code is incorrect. Please try again.'
          });
        }
        else {
          console.error('Unexpected server error: ' + err);
          notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
          this.setState({
            passcodeError: err
          });
        }
      })

  }

  render() {
    const {passcodeError}  = this.state;
      return (
        <Row>
          <Col sm={24} xs={24} style={{marginTop: '20px'}}>
            <h5 style={{textTransform: 'uppercase', letterSpacing: '3px'}}>Two-Factor Authentication</h5>
            <ol>
              <li>Scan the QR code or enter the secret manually in your Authenticator app.</li>
              <li>Enter the 2FA code you get from the Authenticator app and your password to confirm.</li>
            </ol>
          </Col>
          <Col xs={16} xsOffset={4} className="text-center" style={{marginTop: '15px', marginBottom: '15px'}}>
            <QRCode
              value={'otpauth://totp/' + encodeURIComponent(userInfo.uname) + '@bustabit?secret=' + this.state.secret}/>
          </Col>
          <Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
            <Col xs={16} xsOffset={4}>

              <FormGroup controlId="secret" style={{marginBottom: '15px'}}>
                <InputGroup>
                  <InputGroup.Addon>
                    Secret:
                  </InputGroup.Addon>
                  <input value={this.state.secret}
                         type="text"
                         className="form-control"
                         autoComplete="off"
                         readOnly/>
                </InputGroup>
              </FormGroup>

              { passcodeError && <strong className="red-error">{passcodeError}</strong>}
              <FormGroup className={passcodeError ? 'has-error' : ''}>
                <InputGroup>
                  <InputGroup.Addon>
                    2FA Code:
                  </InputGroup.Addon>
                  <input type="number" min="0" max="999999"
                         placeholder="Passcode"
                         className="form-control"
                         value={this.state.passcode}
												 ref={(input) => { this.firstInput = input; }}
                         onChange={(event) => this.onPasscodeChange(event)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col xs={24}>
              <p className="red-error">
                <span style={{textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold'}}>Note:</span> To
                prevent being locked out of your account, we recommend to write the secret down on a piece of paper and
                keep in a safe place.
              </p>
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

export default refresher(SetTwoFactorAuthentication,
  [userInfo, 'UNAME_CHANGED', 'HAS_MFA_CHANGED']
);
