import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ServiceFunc} from "../service/serviceFunc";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ReviewForm} from "./reviewForm";


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
      highlight: -1
    }
  }

  componentDidMount() {
    this.service.getMovie(this.movieId)
      .then(data => this.setState({...data}))
      .catch(error => {
        console.log(error)
      })
  }

  highlightRate = high => event =>{
    this.setState({highlight:high})
  }

  rateMovie = (movieId, mark) => event => {
    this.service.rateMovie(movieId, mark)
  }

  renderPerson = (persons) => {
    return persons.map((person, idx) => {
       return (
         <> <Link to={`/staff/${person.id}`}>{person.name} {person.surname}</Link>{idx < persons.length - 1 ? ', ' : ''} </>
       )})
  }

  handleEditReview = () => event => {
    console.log()
  }

  render() {
    const {id, title, director, actors, writers, plot, year, genres, num_of_ratings, avg_rating, countries, reviews} = this.state;
    return (
          <>
            <h2>{title} ({year})</h2>
            ({countries.map(country => country.name).join(", ")})<br />
            Director: {this.renderPerson(director)} <br />
            Writers: {this.renderPerson(writers)} <br />
            Actors: {this.renderPerson(actors)}<br />
            Rating: {avg_rating} ({num_of_ratings}) <br />
            Genres: {genres.map(genre => genre.name).join(", ") }
            <p>Plot: {plot}</p>
            {[...Array(10)].map( (e, i) => {
              return <FontAwesomeIcon  key={i} icon={this.state.highlight > i-1 ? solidStar : faStar}
              onMouseEnter={this.highlightRate(i)} onMouseLeave={this.highlightRate(-1)} onClick={this.rateMovie(id, i+1)}/>
            } )} <br />
            <ReviewForm movieId={id}/>
            Reviews: {reviews.map(review =>
              <p>
                <Link to={`/review/${review.id}`}>{review.title}</Link> by {review.author}
              </p>
            )}
          </>
    )
  }
}

export { MoviePage };
