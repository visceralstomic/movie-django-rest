import React, {Component} from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";


export default class TopPanel extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <>
        <Link to="/login/">Login</Link>
        <Link to="/signup/">Signup</Link>
      </>
    )
  }
}
