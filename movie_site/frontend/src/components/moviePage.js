import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {ServiceFunc} from "../service/serviceFunc";


class MoviePage extends Component {
  constructor(props) {
    super(props);
    this.service = new ServiceFunc();
    this.movieId = this.props.match.params.movieId;
    this.state = {
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
      reviews: []
    }
  }

  componentDidMount() {
    this.service.getMovie(this.movieId)
      .then(data => this.setState({...data}))
      .then(() => console.log(this.state))
      .catch(error => {
        console.log(error)
      })
  }

  renderPerson = (persons) => {
    return <span>{persons.map(person => <Link to={`/staff/${person.id}`}>{person.name} {person.surname}</Link>)}</span>
  }

  render() {
    const {title, director, actors, writers, plot, year, genres, num_of_ratings, avg_rating, countries, reviews} = this.state;
    return (
          <>
            <h2>{title} ({year})</h2>
            ({countries.map(country => <span>{country.name}</span>)})<br />
            Director:{this.renderPerson(director)} <br />
            Writers: {this.renderPerson(writers)} <br />
            Actors: {this.renderPerson(actors)}<br />
            Rating: {avg_rating} ({num_of_ratings}) <br />
            Genres: {genres.map(genre => <span>{genre.name}</span>) }
            <p>Plot: {plot}</p>
            Reviews: {reviews.map(review =>
              <span><Link to={`/review/${review.id}`}>{review.title}</Link> by {review.author}</span>
            )}
          </>
    )
  }
}

export { MoviePage };
