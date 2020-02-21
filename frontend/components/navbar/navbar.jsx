import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { logout } from '../../actions/session_actions';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  userLoggedIn() {
    return (
      <nav id="navbar">
        <section className="navbar-title">Stocksfolio</section>
        <section className="navbar-right-links">
          <Link to="/portfolio" className="navbar-link">Portfolio</Link>
          <Link to="/transactions" className="navbar-link">Transactions</Link>
          <button onClick={this.props.logout} className="navbar-link button">Logout</button>
        </section>
      </nav>
    );
  }

  userLoggedOut() {
    let link;

    // currently on the login page
    if (this.props.location.pathname === "/login") {
      link = <Link to="/signup" className="navbar-link">Signup</Link>;
    }
    // currently on the signup page
    else {
      link = <Link to="/login" className="navbar-link">Login</Link>;
    }

    return (
      <nav id="navbar">
        <section className="navbar-title">Stocksfolio</section>
        { link }
      </nav>
    );
  };

  // if currentUser exists, render userLoggedIn(), otherwise userLoggedOut()
  render() {
    return this.props.currentUser ? this.userLoggedIn() : this.userLoggedOut();
  }
}

const msp = state => ({
  // map the info of the currentUser from the users slice of state if a user
    // is currently logged in
  currentUser: state.entities.users[state.session.currentUserId]
});

const mdp = dispatch => ({
  logout: () => dispatch(logout())
});

export default withRouter(connect(msp, mdp)(NavBar));