import React, { Component } from "react";
import { render } from "react-dom";
import { HomePage } from "./homePage";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import {MoviePage} from "./moviePage";
import StaffPage from "./staffPage";
import SinglReviewPage from "./singlReviewPage";
import NavBarMenu from "./navBarMenu";
import Login from "./auth/login";
import SignUp from "./auth/signup";
import TopPanel from "./topPanel";
import {UserFunc} from "../service/serviceFunc";
import MovieForm from "./movieForm";
import AdditionalInfo from "./additionalInfo/additionalInfo";
import UserPage from "./user/userPage";



class App extends Component {
  constructor(props){
    super(props);
    this.auth = new UserFunc();
    this.state = {
      logged_in: localStorage.getItem('access_token') ? true : false,
      user: {
        id: null,
        username: '',
        isStaff: null
      }
    }
  }

  getUser(){
    this.auth.getCurrentUser().then(data => {
      this.setState({user: {id: data.uid, username:data.username, isStaff: data.is_staff} })
      })
  }

  componentDidMount(){
    if(this.state.logged_in){
      this.getUser()
    }
  }


  loggedStatus = (status) => {
    this.setState({logged_in:status})
    if(this.state.logged_in){
      this.getUser()
    } else {
      this.setState({user: {id: null, username:'', isStaff: null} })
    }
  }

  render() {
    
    return  (
      <Router>
        <>
        <TopPanel loggedStatus={this.loggedStatus} user={this.state.user} logged_in={this.state.logged_in}/>

        <Switch>
          <Route exact path="/" 
            render={ props => <HomePage {...props} logged_in={this.state.logged_in} /> } />
          <Route  path="/movie/:movieId"  
          render={ props=> <MoviePage {...props} user={this.state.user} loggedIn={this.state.logged_in} /> } />
          <Route  path="/staff/:staffId" component={StaffPage} />
          <Route  path="/review/:reviewId" 
            render={ props => < SinglReviewPage {...props} user={this.state.user} /> }  /> 
          <Route  path="/login/" 
          render={ props => <Login {...props} loggedIn={this.loggedStatus} />} />
          <Route  path="/signup/" component={SignUp}/>
          <Route  path="/movieform/" component={MovieForm} />
          <Route  path="/addinfo/" component={AdditionalInfo} />
          <Route  path="/user/:uid" component={UserPage} />
        </Switch>
        </>
      </Router>
    )
  }
}


export default App;

const app = document.getElementById('app');
render(<App />, app);
