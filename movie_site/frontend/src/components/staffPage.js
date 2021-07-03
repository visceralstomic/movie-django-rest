import React, {Component} from "react";
import {Link} from "react-router-dom";
import {ServiceFunc} from "../service/serviceFunc";
import {ListGroup, ListGroupItem, } from "reactstrap";

export default class StaffPage extends Component {
  constructor(props){
    super(props);
    this.service = new ServiceFunc;
    this.staffId = this.props.match.params.staffId;
    this.state = {
      name: null,
      surname: null,
      director: [],
      writers: [],
      actors: []
    }
  }

  setStaff(staffId){
    this.service.getStaffPerson(staffId)
      .then(data => this.setState({...data}))
      .catch(error => {
        console.log(error);
      })
  }

  componentDidMount(){
    this.setStaff(this.staffId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.staffId !== prevProps.match.params.staffId) {
      this.setStaff(this.props.match.params.staffId);
    }
  }


  render() {
    const {name, surname, director, writers, actors } = this.state;
    return (
      <div className="staff-block">
        <h2>{name} {surname}</h2>
        <div>
          {[ [director, "Director"], [writers, "Writer"], [actors,'Actor'] ].map(element => {
            return (
              <div key={element[1]}>
              <ListGroup >
                <ListGroupItem tag="h4" className="staff-list-title" color="dark">
                  {element[1]}
                </ListGroupItem>
                {element[0].length != 0 ? element[0].map(movie => 
                  <ListGroupItem key={movie.id} tag={Link} to={`/movie/${movie.id}`} action>
                    {movie.title} ({new Date(movie.year).getFullYear()})
                </ListGroupItem>)
                 :<ListGroupItem>
                    No entries in that role
                  </ListGroupItem> }
              </ListGroup> <br/>
              </div>
              )
          })}
        </div>
      </div>
    )
  }

}
