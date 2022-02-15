
import React from "react";
import { Switch, Router, Route } from "react-router-dom";
import history from "./history";
import MainPage from './pages/index';



const App = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route
          path="/"
          exact
          component={MainPage}
        />
      </Switch>
    </Router>
  );
};

export default App;
