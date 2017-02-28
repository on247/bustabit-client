import React, { PureComponent } from 'react'
import { Row, Form, FormGroup, Col, InputGroup } from 'react-bootstrap'
import socket from '../../socket'
import { randomPassword, validatePassword } from '../../util/belt'
import userInfo from '../../core/userInfo';
import refresher from '../../refresher';
import notification from '../../core/notification'
import { browserHistory } from 'react-router'



class UpdatePassword extends PureComponent {
  constructor(props) {
    super(props);
		this.firstInput = null; // this is a ref
    this.state = {
      oldPassword: '',
      newPassword: randomPassword(10),
      oldPasswordError: null,
      submitting: false,
			touched: false
    };
  }
	componentDidMount(){
		this.firstInput.focus();
	}
  onOldPasswordChange(event) {
    const oldPassword = event.target.value;
    const oldPasswordError = this.state.touched ? this.validatePassword(oldPassword) : null;
    this.setState({oldPassword, oldPasswordError});
  }

  // this returns true if the form is valid
  validate(values) {
    const oldPasswordError = validatePassword(values.oldPassword);
    this.setState({
      oldPasswordError
    });
    return !oldPasswordError;
  }

  generate() {
    this.setState({newPassword: randomPassword(10)});
  }

  handleSubmit(event) {
    event.preventDefault();
    let {oldPassword, newPassword} = this.state;
    if (!this.validate(this.state)) {
      console.warn('submitted while not valid');
      return
    }
		this.setState({ submitting: true, touched: true });
      socket.send('updatePassword', {oldPassword, newPassword})
        .then(info => {
          console.log(info);
					this.setState({ submitting: false});
          browserHistory.push('/');
          notification.setMessage(<span><span className="green-tag">Success!</span> Your password has been updated.</span>);
        }, err => {
					this.setState({ submitting: false});
          if (err === 'INVALID_OLD_PASSWORD') {
            this.setState({
              oldPasswordError: 'The old password is incorrect.'
            });
          }
          else {
            console.error('Unexpected server error: ' + err);
            notification.setMessage(<span><span className="red-tag">Error </span> Unexpected server error: {err}.</span>, 'error');
            this.setState({
              oldPasswordError: err
            });
          }
        })
  }

  render() {
    const { oldPasswordError, submitting }  = this.state;
    return (
          <Row>
            <Col sm={24} xs={24} style={{marginTop: '20px'}}>
              <h5 style={{ textTransform: 'uppercase', letterSpacing: '3px'}}>Update Password</h5>
            </Col>

            <Form horizontal onSubmit={(event) => this.handleSubmit(event)}>
              <Col xs={16} xsOffset={4}>
                { oldPasswordError && <strong className="red-error">{oldPasswordError}</strong>}
                <FormGroup className={oldPasswordError ? 'has-error' : ''}>
                  <InputGroup>
                    <InputGroup.Addon>
                      Old Password:
                    </InputGroup.Addon>
                    <input type="password"
                           placeholder="Old Password"
                           name="oldPassword"
                           className="form-control"
                           value={this.state.oldPassword}
													 ref={(input) => { this.firstInput = input; }}
                           onChange={(event) => this.onOldPasswordChange(event)}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col xs={16} xsOffset={4}>
                <FormGroup controlId="newPassword">
                  <InputGroup>
                    <InputGroup.Addon>
                      New Password:
                    </InputGroup.Addon>
                    <input name="newPassword"
                           type="text"
                           className="form-control"
                           readOnly
                           value={this.state.newPassword}
                    />
                    <InputGroup.Button>
                      <button className="btn btn-default form-control" type="button" onClick={() => this.generate()}>
                        <i className="fa fa-refresh"></i>
                      </button>
                    </InputGroup.Button>
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


export default refresher(UpdatePassword,
	[userInfo, 'UNAME_CHANGED']
);