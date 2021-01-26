import React, {Component} from "react";
import { Link, Redirect } from "react-router-dom";
import {AuthFunc} from "../service/serviceFunc";

export default class TopPanel extends Component {
  constructor(props){
    super(props);
    this.loggedStatus = this.props.loggedStatus
    this.auth = new AuthFunc();
  }

  handleLogout = () => {
    this.auth.logoutAndBlacklist().then(res => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.loggedStatus(false, '');
    }).catch(error => {
        console.log(error)
    })

  }

  render() {
    const {username, logged_in} = this.props;
    return (
      <>
        {logged_in ?
           <div>
                <h3>Hi, {username}</h3>
                <button onClick={this.handleLogout}>Logout</button>
            </div>
          :<div>
                <Link to="/login/">Login</Link>
                <Link to="/signup/">Signup</Link>
                
           </div> }
      </>
    )
  }
}
