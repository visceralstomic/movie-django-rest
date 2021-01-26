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
import {AuthFunc} from "../service/serviceFunc";


class App extends Component {
  constructor(props){
    super(props);
    this.auth = new AuthFunc();
    this.state = {
      logged_in: localStorage.getItem('access_token') ? true : false,
      username: ''
    }
  }

  getUser(){
    this.auth.getCurrentUser().then(data => {
        this.setState({username: data.user})
      })
  }

  componentDidMount(){
    if(this.state.logged_in){
      this.getUser()
    }
  }



  loggedStatus = (status, username) => {
    this.setState({logged_in:status, username:username})
  }

  render() {

    return  (
      <Router>
        <NavBarMenu />

        <TopPanel loggedStatus={this.loggedStatus} username={this.state.username} logged_in={this.state.logged_in}/>

        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route  path="/movie/:movieId" component={MoviePage} />
          <Route  path="/staff/:staffId" component={StaffPage} />
          <Route  path="/review/:reviewId" component={SinglReviewPage} />
          <Route  path="/login/" render={ props => <Login {...props} loggedIn={this.loggedStatus} />} />
        </Switch>
      </Router>
    )
  }
}


export default App;

const app = document.getElementById('app');
render(<App />, app);
