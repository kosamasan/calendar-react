import React, { Component } from 'react';
import { BrowserRouter, Route, NavLink, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

import Auth from './containers/Auth/Auth';
import Home from './containers/Home/Home';
import DaySchedule from './containers/DaySchedule/DaySchedule';
import Logout from './containers/Auth/Logout/Logout';
import './App.css';

class App extends Component {

  componentDidMount () {
    this.props.onTryAutoSignup();
  }

  render() {
    let header = '';
    if (this.props.isAuthenticated) {
    header = <header>
    <nav className="navbar navbar-inverse">
      <p className="navbar-text">Hello, {this.props.username}</p>
      <ul className="nav navbar-nav">
      <li>
          <NavLink
            to="/"
            exact
            activeClassName="my-active"
            activeStyle={{
                color: '#ffffff',
                backgroundColor: '#179b94',
                textDecoration: 'none',
                borderRadius: '10px'
            }}>Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/logout/"
            exact
            activeClassName="my-active"
            activeStyle={{
                color: '#ffffff',
                backgroundColor: '#179b94',
                textDecoration: 'none',
                borderRadius: '10px'
            }}>Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  </header>
  }
  
  let routes = (
    <Switch>
        <Route path="/auth" component={Auth} />
        <Redirect to="/auth" />
    </Switch>
  );

  if ( this.props.isAuthenticated) {
  routes = (
    <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/logout" component={Logout} />
        <Route path="/day-schedule" component={DaySchedule} />
        <Redirect to="/" />
    </Switch>
    );
  }
  return (
    <BrowserRouter>
      <div className="App">
          {header}
          <div className="container">
              {routes}
          </div>
          <footer className="footer" style={{ backgroundColor: '#222', 'padding': '5px', 'marginTop': '40px' }}>
              <div className="container footer-list">
                  <div className='center'style={{ 'color': '#ffffff' }}>&#169; Event Calendar</div>
              </div>
          </footer>
      </div>
    </BrowserRouter>
  );
  }
}

const mapStateToProps = state => {
  return {
      isAuthenticated: state.auth.token !== null,
      username: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
      onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);