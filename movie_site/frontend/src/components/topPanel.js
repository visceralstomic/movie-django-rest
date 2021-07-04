import React, {Component} from "react";
import { Link, Redirect } from "react-router-dom";
import {UserFunc} from "../service/serviceFunc";
import SearchPanel from "./search.js";
import {Button} from "reactstrap";


export default class TopPanel extends Component {
  constructor(props){
    super(props);
    this.loggedStatus = this.props.loggedStatus
    this.auth = new UserFunc();
  }

  handleLogout = () => {
    this.auth.logoutAndBlacklist().then(res => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.loggedStatus(false);
    }).catch(error => {
        console.log(error)
    })

  }

  render() {
    const {user, logged_in} = this.props;
    return (
      <div className="top-bar">
        <Link className="site-title"  to="/">MOVIE|RATER</Link>
        <SearchPanel />
        {logged_in ?
           <div className="logged-block">
                {user.isStaff ? <span>{user.username} </span>
                 :<Link className="user-link" to={`/user/${user.id}`}>{user.username}</Link> }
                {user.isStaff ?
                  <>
                    <Button className="admin-button" outline color="dark" tag={Link} to="/movieform/" >Create movie</Button>{' '}
                    <Button className="admin-button" outline color="dark" tag={Link} to="/addinfo/">Additional info</Button>{' '}                  
                  </>
                : null }
                <Button outline color="dark" onClick={this.handleLogout}>Logout</Button>
            </div>
          :<div className="auth-block" >
                <Link to="/login/">Login</Link>
                <Link to="/signup/">Signup</Link>
                
           </div> }
      </div>
    )
  }
}
