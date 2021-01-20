import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class StaffPage extends Component {
  constructor(props){
    super(props);
    this.staffId = this.props.match.params.staffId;
    this.state = {
      name: null,
      surname: null,
      director: [],
      writers: [],
      actors: []
    }
  }

  componentDidMount(){

    fetch("/api/staff/" + this.staffId)
      .then(response => {
        if (response.status > 400) {
          throw new Error("Something went wrong")
        }
        return response.json();
      })
      .then(data => this.setState({...data}))
      .then(() => console.log(this.state))
      .catch(error => {
        console.log(error);
      })
  }


  render() {
    const {name, surname, director, writers, actors } = this.state;
    return (
      <>
        <h2>{name} {surname}</h2>
        <div>
          {[ [director, "Director"], [writers, "Writer"], [actors,'Actor'] ].map(element => {
            return (
              <ul>
                <h3>{element[1]}</h3>
                {element[0].map(movie => <li><Link to={`/movie/${movie.id}`}>{movie.title}</Link></li>)}
              </ul>)
          })}
        </div>
      </>
    )
  }

}
