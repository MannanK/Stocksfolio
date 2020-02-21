import React from "react";
import NavBar from './navbar/navbar';
import Footer from './footer/footer';
import { Switch, Redirect } from "react-router-dom";
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import LoginFormContainer from './session_form/login_form_container';
import SignupFormContainer from './session_form/signup_form_container';
import PortfolioContainer from './portfolio/portfolio';
import TransactionsContainer from './transactions/transactions';

const App = () => (
  <>
    <NavBar />
    
    <div id="body">
      <Switch>
        <ProtectedRoute exact path="/portfolio" component={PortfolioContainer} />
        <ProtectedRoute exact path="/transactions" component={TransactionsContainer} />
        <AuthRoute exact path="/login" component={LoginFormContainer} />
        <AuthRoute exact path="/signup" component={SignupFormContainer} />

        {/* no paths matched, that means the user entered a bad URL and so they
      should be redirected to a different default landing page */}
        <Redirect to="/login" />
      </Switch>
    </div>

    <Footer />
  </>
);

export default App;