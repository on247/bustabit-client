import React, { PureComponent } from 'react'
import { Row, Form, FormGroup, Col, InputGroup } from 'react-bootstrap'
import { validateEmail, validatePassword } from '../../util/belt'
import socket from '../../socket'
import { browserHistory } from 'react-router'
import userInfo from '../../core/userInfo';
import refresher from '../../refresher';
import notification from '../../core/notification'


class UpdateEmail extends PureComponent {

  constructor(props) {
    super(props);
		this.firstInput = null; // this is a ref
    this.state = {
      email: userInfo.email || '',
      password: '',
      error: null,
      emailError: null,
      passwordError: null,
			submitting: false,
			touched: false
    };
  }
	componentDidMount(){
		this.firstInput.focus();
	}

  // this returns true if the form is valid
  validate(values) {
    let isValid = true;

    const passwordError = validatePassword(values.password);
    this.setState({
      passwordError
    });
    isValid = isValid && !passwordError;

    const emailError = validateEmail(values.email);
    this.setState({
      emailError
    });
    isValid = isValid && !emailError;

    return isValid;
  }

  onEmailChange(event) {
    const email = event.target.value;
    const emailError = this.state.touched ? validateEmail(email) : null;
    this.setState({email, emailError});
  }

  onPasswordChange(event) {
    const password = event.target.value;
    const passwordError = this.state.touched ? validatePassword(password) : null;
    this.setState({password, passwordError});
  }

  handleSubmit(event) {
    event.preventDefault();
    let {email, password} = this.state;
    if (!this.validate(this.state)) {
      console.warn('submitted while not valid');
      return
    }
		this.setState({ submitting: true, touched: true });
    socket.send('updateEmail', {email, password})
      .then(info => {
        console.log(info);
				this.setState({ submitting: false});
        browserHistory.push('/');
        notification.setMessage(<span><span className="green-tag">Success!</span> Your email has been updated.</span>);
      }, err => {
				this.setState({ submitting: false});
        if (err === 'INVALID_PASSWORD') {
          this.setState({
            passwordError: 'The password is incorrect.'
          });
        }
        else {
          console.error('Unexpected server error: ' + err);
          notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
        }
      })
  }

  render() {
    const { emailError, passwordError, submitting }  = this.state;
    return (
      <Row>
          <Col sm={24} xs={24} style={{marginTop: '20px'}}>
            <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Edit Email</h5>
          </Col>
        <Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
          <Col xs={16} xsOffset={4}>
            { emailError && <strong className="red-error">{emailError}</strong>}
            <FormGroup className={emailError ? 'has-error' : ''}>
              <InputGroup>
                <InputGroup.Addon>
                  Recovery Email:
                </InputGroup.Addon>
                <input type="text"
                       placeholder="Email"
                       className="form-control"
                       value={this.state.email}
											 ref={(input) => { this.firstInput = input; }}
                       onChange={(event) => this.onEmailChange(event)}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={16} xsOffset={4}>
            { passwordError && <strong className="red-error">{passwordError}</strong>}
            <FormGroup className={passwordError ? 'has-error' : ''}>
              <InputGroup>
                <InputGroup.Addon>
                  Your Password:
                </InputGroup.Addon>
                <input type="password"
                       placeholder="Password"
                       name="password"
                       className="form-control"
                       value={this.state.password}
                       onChange={(event) => this.onPasswordChange(event)}
                />
              </InputGroup>
            </FormGroup>
          </Col>

          <Col xs={16} xsOffset={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <button className='btn btn-success btn-lg' type="submit" disabled={ submitting }>
							{ this.state.submitting ? <i className="fa fa-spinner fa-pulse fa-fw"></i> : 'Submit'}
            </button>
          </Col>
        </Form>
      </Row>

    )
  }
}

export default refresher(UpdateEmail,
	[userInfo, 'UNAME_CHANGED', 'EMAIL_CHANGED']
);
