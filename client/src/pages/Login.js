import React, { Component } from 'react';
import { Link } from "react-router-dom";
import 'whatwg-fetch';


import {
  setInStorage,
  getFromStorage,
} from '../utils/storage';



class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',

    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('order_me_this_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onSignUp() {
    // Grab state
    const {
      signUpEmail,
      signUpPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
  }

  onSignIn() {
    // Grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail.trim(),
        password: signInPassword.trim(),
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          setInStorage('order_me_this_app', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          }, this.props.handleSignIn
          );
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('order_me_this_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpError,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (
        <div>

          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            }
            <div className="row">
              <p>Sign In To Start Ordering!</p>
              </div>
              <div className="row">
              <div className="col d-flex flex-column justify-content-center">
                <input
                  type="email"
                  placeholder="Email"
                  value={signInEmail}
                  className="flex-grow"
                  onChange={this.onTextboxChangeSignInEmail}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={signInPassword}
                  className="flex-grow"
                  onChange={this.onTextboxChangeSignInPassword}
                />
              </div>
              <div className="col d-flex justify-content-end">
                <button className="btn btn-primary" onClick={this.onSignIn}>Login</button>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div>
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            }
            <div className="row">
              <p>Sign Up</p>
            </div>
            <div className="row">
              <div className="col d-flex flex-column justify-content-center">
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpEmail}
                  className="flex-grow"
                  onChange={this.onTextboxChangeSignUpEmail}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={signUpPassword}
                  className="flex-grow"
                  onChange={this.onTextboxChangeSignUpPassword}
                />
              </div>
              <div className="col d-flex justify-content-end">
                <button className="btn btn-primary" onClick={this.onSignUp}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
     
      <div>
         
        <button className="btn btn-primary" onClick={this.logout}>Logout</button>
        <br />
        <button className="btn btn-primary" onClick={<Link className="navbar-brand" to="/home" />}>
          Take me to the Home Page
        </button>
        
      </div>
    );
  }
}

export default Login;