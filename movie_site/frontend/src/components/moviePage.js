import React, { Component } from 'react';


class MoviePage extends Component {
  constructor(props) {
    super(props);
    this.movieId = this.props.match.params.movieId;
    this.state = {
      data:[],
      loaded: true,
      placeholder: 'loading'
    }
  }

  componentDidMount() {
    fetch("/api/movies/" + this.movieId)
      .then(response => {
        if (response.status > 400) {
          return this.setState({placeholder:'Some error accrued'});
        }
        return response.json();
      })
      .then(data => this.setState({data:data, loaded:true})).then(()=> console.log(this.state.data))
  }

  render() {
    return <h2> Movie page </h2>
  }
}

export { MoviePage };
