import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import {MoviePage} from "./moviePage";
import StaffPage from "./staffPage";
import SinglReviewPage from "./singlReviewPage";

class HomePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      loaded: false
    };
  }


  componentDidMount(){
   fetch("/api/movies")
     .then(response => {
       if (response.status > 400) {
         throw new Error("Something went wrong")
       }
       return response.json();
     })
     .then(data => {
       this.setState(() => {
         return {
           data,
           loaded: true
         };
       });
     })
     .catch(error => {
       console.log(error)
     });
 }


  renderHomePage = event => {

    return (
      <ul>
          <h2>Movies</h2>
          {this.state.data.map(movie => {
            return (
              <li key={movie.id}>
                <h3>Title: <Link to={`/movie/${movie.id}`}>{movie.title}</Link></h3>
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
          <Route path="/staff/:staffId" component={StaffPage} />
          <Route path="/review/:reviewId" component={SinglReviewPage} />
        </Switch>
      </Router>
    )
  }
}

export { HomePage };
