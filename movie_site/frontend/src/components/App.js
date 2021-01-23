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
    this.state = {
      logged_in: localStorage.getItem('access_token') ? true : false,
      username: ''
    }
  }

  componentDidMount(){

    if(this.state.logged_in){
      fetch("/users/current_user/", {
        headers:{
          'access': localStorage.getItem('access_token'),
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({username: data.user})
      })
    }
  }

  handleLogout = () => {
    fetch("/blacklist/",{
      method: "POST",
      refresh_token: localStorage.getItem("refresh_token")
    }).then(res => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.setState({logged_in: false});
    }).catch(error => {
        console.log(error)
    })

  }

  render() {

    return  (
      <Router>
        <NavBarMenu />

        <TopPanel  username={this.state.username} logged_in={this.state.logged_in}/>

        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route  path="/movie/:movieId" component={MoviePage} />
          <Route  path="/staff/:staffId" component={StaffPage} />
          <Route  path="/review/:reviewId" component={SinglReviewPage} />
          <Route  path="/login/" component={Login} />
        </Switch>
        { this.state.logged_in ? <button onClick={this.handleLogout}>Logout</button> : null}
      </Router>
    )
  }
}


export default App;

const app = document.getElementById('app');
render(<App />, app);
