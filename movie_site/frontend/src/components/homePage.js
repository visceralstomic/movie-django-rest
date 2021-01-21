import React, { Component } from "react";
import {Link} from 'react-router-dom';
import {ServiceFunc} from "../service/serviceFunc";


class HomePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],
      loaded: false
    };

    this.service = new ServiceFunc();
  }


  componentDidMount(){
   this.service.getMovieList().then(data => {
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


  render(){
    return (
      <>
        <ul>
            {this.state.data.map(movie => {
              return (
                <li key={movie.id}>
                  <h3>Title: <Link to={`/movie/${movie.id}`}>{movie.title}</Link></h3>
                </li>
              );
            })}
        </ul>
      </>
    )
  }
}

export { HomePage };
