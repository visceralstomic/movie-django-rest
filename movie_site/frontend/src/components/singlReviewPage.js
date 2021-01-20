import React, {Component} from 'react';
import {Link} from 'react-router-dom';


export default class SinglReviewPage extends Component {
  constructor(props){
    super(props);
    this.reviewId = this.props.match.params.reviewId;
    this.state = {
      title: null,
      created: null,
      author: null,
      review_text: null,
      movie: null
    }
  }

  componentDidMount(){
    fetch("/api/movies/reviews/" + this.reviewId)
      .then(response => {
        if (response.status > 400){
          throw new Error('Some error accrued')
        }
        return response.json();
      })
      .then(data => this.setState({...data}))
      .then(() => console.log(this.state))
      .catch(error=>{
        console.log(error);
      })
  }

  render(){
    const {title, created, author, review_text, movie} = this.state;

    return (
      <>
        <h2>{movie}</h2>
        <h3>{title}</h3>
        {author}, {created}
        <p>{review_text}</p>
      </>
    )
  }
}
