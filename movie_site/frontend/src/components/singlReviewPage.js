import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ServiceFunc} from "../service/serviceFunc";
import {ReviewForm} from "./reviewForm"

export default class SinglReviewPage extends Component {
  constructor(props){
    super(props);
    this.service = new ServiceFunc;
    this.reviewId = this.props.match.params.reviewId;
    this.state = {
      id: null,
      title: null,
      created: null,
      author: null,
      review_text: null,
      movie: [],
      edit: false
    }
  }

  componentDidMount(){
    this.service.getReview(this.reviewId)
      .then(data => this.setState({...data}))
      .catch(error=>{
        console.log(error);
      })
  }

  editReview = event => {
    this.setState({edit: true})
  }
  cancelEdit = event => {
    this.setState({edit: false})
  }

  deleteReview = event => {
    fetch(`/api/movies/reviews/${this.state.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token')
      }
    })
  }


  render(){
    const {id, title, created, author, review_text, movie} = this.state;

    return (
      <>
        <h2><Link to={`/movie/${movie.id}`}>{movie.title}</Link></h2>
        { !this.state.edit
          ?<div>
            <h3>{title}</h3>
            {author}, {created}
            <p>{review_text}</p>
            <button onClick={this.editReview}>Edit</button>
            <button onClick={this.deleteReview}>Delete</button>
          </div>
          :<div>
           <ReviewForm editReview={{id: id, title: title, review_text: review_text }}/>
           <button onClick={this.cancelEdit}>Cancel</button>
           </div>
        }

      </>
    )
  }
}
