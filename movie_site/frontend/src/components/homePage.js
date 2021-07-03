import React, { Component } from "react";
import {Link} from 'react-router-dom';
import {ServiceFunc} from "../service/serviceFunc";
import Filters from "./filters";
import { Container, Row, Col, ListGroup, Spinner,
      ListGroupItem, ListGroupItemText, ListGroupItemHeading} from "reactstrap";
import { movieList } from "../tests/fake-data";

      
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
      <>
        {this.state.loaded
        ? <>
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
                          {movie.genres.map(genre => genre.name).join(", ")} | {" "}
                          Rating: {Math.round(movie.avg_rating * 1000) / 1000}
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
          </> : <Spinner className='spinn' color="dark" />}
      </>
    )
  }
}

export { HomePage };
