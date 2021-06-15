import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class NavBarMenu extends Component {

  render() {
     return (
       <h1 className="site-title"><Link to="/">Movie_rater</Link></h1>
     )
  }
}
