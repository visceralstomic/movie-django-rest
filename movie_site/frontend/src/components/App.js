import React, { Component } from "react";
import { render } from "react-dom";
import { HomePage } from "./homePage";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import {MoviePage} from "./moviePage";
import StaffPage from "./staffPage";
import SinglReviewPage from "./singlReviewPage";
import NavBarMenu from "./navBarMenu";
import Login from "./auth/login.js"
import TopPanel from "./topPanel";

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return  (
      <Router>
        <NavBarMenu />
        <TopPanel />
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route  path="/movie/:movieId" component={MoviePage} />
          <Route  path="/staff/:staffId" component={StaffPage} />
          <Route  path="/review/:reviewId" component={SinglReviewPage} />
          <Route  path="/login/" component={Login} />
        </Switch>
      </Router>
    )
  }
}


export default App;

const app = document.getElementById('app');
render(<App />, app);
