import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ServiceFunc} from "../service/serviceFunc";


export default class SinglReviewPage extends Component {
  constructor(props){
    super(props);
    this.service = new ServiceFunc;
    this.reviewId = this.props.match.params.reviewId;
    this.state = {
      title: null,
      created: null,
      author: null,
      review_text: null,
      movie: []
    }
  }

  componentDidMount(){
    this.service.getReview(this.reviewId)
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
        <h2><Link to={`/movie/${movie.id}`}>{movie.title}</Link></h2>
        <h3>{title}</h3>
        {author}, {created}
        <p>{review_text}</p>
      </>
    )
  }
}
