import React from "react";
import NavBar from './navbar/navbar';
import { Switch, Route } from "react-router-dom";
import { AuthRoute, ProtectedRoute } from '../util/route_util';

const App = () => (
  <>
    <NavBar />
    
    <Switch>
      
      {/* default "not found" page landing, depending on logged in or not logged in */}
      {/* <Route component={Logincontainer} /> */}
    </Switch>
  </>
);

export default App;