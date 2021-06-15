import React, { Component } from "react";
import {Link} from 'react-router-dom';
import {ServiceFunc} from "../service/serviceFunc";
import Filters from "./filters";
import { Container, Row, Col, ListGroup,
      ListGroupItem, ListGroupItemText, ListGroupItemHeading} from "reactstrap";

class HomePage extends Component {
  constructor(props){
    super(props);
    this.loggedIn = this.props.logged_in; 
    this.state = {
      data:[],
      loaded: false
    };

    this.service = new ServiceFunc();
  }

  getMovies = (params) => {
    this.service.getMovieList(params).then(data => {
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

  componentDidMount(){
    this.getMovies();
  }


  render(){
    return (
      <Container>
        <Row>
          <Col>
            <ListGroup>
              {this.state.data.map(movie => {
                return (
                  <ListGroupItem tag={Link} color="secondary" to={`/movie/${movie.id}`} key={movie.id} action>
                    <ListGroupItemHeading> 
                      {movie.title}
                    </ListGroupItemHeading>
                    <ListGroupItemText>
                      {new Date(movie.year).getFullYear()} | {movie.countries.map(country => country.name).join(", ")} |{' '}
                       {movie.genres.map(country => country.name).join(", ")}
                    </ListGroupItemText>
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </Col>
          <Col >
              <Filters getMovies={this.getMovies} loggedIn={this.loggedIn}/>
          </Col> 
        </Row>
      </Container>
    )
  }
}

export { HomePage };
