import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ServiceFunc} from "../service/serviceFunc";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ReviewForm} from "./reviewForm";
import {Card, CardHeader, CardText, CardBody, CardFooter, Button,
        ListGroup, ListGroupItem, Jumbotron, Container } from "reactstrap";

class MoviePage extends Component {
  constructor(props) {
    super(props);
    this.service = new ServiceFunc();
    this.movieId = this.props.match.params.movieId;
    this.state = {
      id: null,
      title: null,
      director: [],
      year: null,
      writers: [],
      actors: [],
      countries: [],
      plot: null,
      genres: [],
      num_of_ratings: null,
      avg_rating: null,
      reviews: [],
      highlight: null,
      user_rating: null
    }
  }

  setMovie(movieId) {
    this.service.getMovie(movieId)
      .then(data => this.setState({...data}))
      .catch(error => {
        console.log(error)
      })
    this.service.getUserMovieRating(movieId)
    .then(({rating}) => {
      const mark = typeof rating === 'number' ? rating - 1 : -1
      this.setState({highlight: mark, user_rating: mark})
    })
  }  
  componentDidMount() {
    this.setMovie(this.movieId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.movieId !== prevProps.match.params.movieId) {
      this.setMovie(this.props.match.params.movieId);
    }
  }

  highlightRate = high => event =>{
    this.setState({highlight:high})
  }

  rateMovie = (movieId, mark) => event => {
    this.setState({user_rating: mark - 1})
    this.service.rateMovie(movieId, mark)
  }

  renderPerson = (persons) => {
    return persons.map((person, idx) => {
       return (
         <span key={person.id} className="person-name"> 
           <Link to={`/staff/${person.id}`}>{person.name} {person.surname}</Link>{idx < persons.length - 1 ? ', ' : ''} 
         </span>
       )})
  }

  approveReview = (reviewId) => event => {
    this.service.approveReview(reviewId).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  adminRemoveReview = (reviewId) => event => {
    this.service.adminRemoveReview(reviewId).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  userWroteReview = (userId, reviews) => reviews.map(review => review.author.id).includes(userId)



  render() {
    const {user, loggedIn} = this.props;
    const {id, title, director, actors, writers, plot, year, genres, num_of_ratings, avg_rating, countries, reviews, user_rating} = this.state;

    return (
          <div className="movie-container">
            <Card body inverse style={{ backgroundColor: '#E4E4E4', color: '#232323'}}>
              <CardHeader >
                <div className="movie-header">
                  <h3>{title} ({ new Date(year).getFullYear() })</h3>
                  ({countries.map(country => country.name).join(", ")})
                </div>
              </CardHeader>
              <CardBody>
                <CardText style={{ color: '#232323'}}>
                  Director: {this.renderPerson(director)} <br />
                  Writers: {this.renderPerson(writers)} <br />
                  Actors: {this.renderPerson(actors)}<br />
                  Rating: {Math.round(avg_rating * 1000) / 1000} ({num_of_ratings}) <br />
                  Genres: {genres.map(genre => genre.name).join(", ") }
                  <p>Plot: {plot}</p>
                </CardText>
              </CardBody>
              { !user.isStaff && loggedIn ?
               <CardFooter  className="footer"> 
               Your rating: {[...Array(10)].map( (e, i) => {
                    return <FontAwesomeIcon className='stars' key={i} 
                    icon={this.state.highlight > i-1 ? solidStar : faStar}
                    onMouseEnter={this.highlightRate(i)} onMouseLeave={this.highlightRate(user_rating)} 
                    onClick={this.rateMovie(id, i+1)}/>
                })}
                {!this.userWroteReview(user.id, reviews) 
                ? <>
                    <h5>Write review</h5>
                    <ReviewForm movieId={id}/>
                  </> : null}
                <br />
              </CardFooter>
              : null }
            </Card>
            
            <div className="review-list">
              <ListGroup>
                <ListGroupItem tag="h4" color="secondary">Reviews</ListGroupItem>
                {reviews.length != 0 ? reviews.map(review =>
                  {
                    if (review.approved || user.isStaff){
                      return (
                        <ListGroupItem key={review.id} className="d-flex justify-content-between">
                          <Link to={`/review/${review.id}`} className="review-link">{review.title} by {review.author.username} </Link>
                          {user.isStaff 
                          ? <div>
                              {!review.approved 
                              ? <><Button color="success" onClick={this.approveReview(review.id)}>Approve</Button>{' '}</> : null}
                              <Button color="danger" onClick={this.adminRemoveReview(review.id)}>Delete</Button>
                            </div>
                          : null }
                        </ListGroupItem>
                      )
                    }
                  }
                )
                : <>
                    <Jumbotron>
                      <Container>
                        <h4>
                          There is no reviews for this movie
                        </h4>
                      </Container>
                    </Jumbotron>                
                  </>}
              </ListGroup>
            </div>
          </div>
    )
  }
}

export { MoviePage };
