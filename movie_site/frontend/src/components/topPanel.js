import React, {Component} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";


export default class TopPanel extends Component {
  constructor(props){
    super(props);
    
  }

  render() {
    const {username, logged_in} = this.props;
    return (
      <>
        {logged_in ? <h3>Hi, {username}</h3>
          :<div><Link to="/login/">Login</Link>
                <Link to="/signup/">Signup</Link>
        </div> }
      </>
    )
  }
}
