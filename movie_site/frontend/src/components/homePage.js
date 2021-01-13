import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import {MoviePage} from "./moviePage"

class HomePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      loaded: false,
      placeholder: "Loading"
    };
  }


  componentDidMount(){
   fetch("/api/movies")
     .then(response => {
       if (response.status > 400) {
         return this.setState(() => {
           return { placeholder: "Something went wrong!"}
         });
       }
       return response.json();
     })
     .then(data => {
       this.setState(() => {
         console.log(data);
         return {
           data,
           loaded: true
         };
       });
     });
 }


  renderHomePage = event => {
    return (
      <ul>
          <h2>Movies</h2>
          {this.state.data.map(movie => {
            return (
              <li key={movie.id}>
                <h3>Title: {movie.title}</h3>
              </li>
          );
        })}
      </ul>
        );
  }


  render(){
    return (
      <Router>
        <Switch>
          <Route exact path="/" render={this.renderHomePage}/>
          <Route path="/movie/:movieId" component={MoviePage} />
        </Switch>
      </Router>
    )
  }
}

export { HomePage };
