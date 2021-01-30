import React, {Component} from "react";
import {ServiceFunc} from "../service/serviceFunc";

export class ReviewForm extends Component {

  constructor(props){
    super(props);
    this.auth = new ServiceFunc();
    this.state = {...this.props.editReview}
  }

  handleSubmit = event => {
    event.preventDefault();
    const body = {
      "title": this.state.title,
      "review_text": this.state.review_text
    }
    if (this.state.id === null) {
      this.auth.createReview({...body,"movie": this.props.movieId})
    } else {
      this.auth.editReview(this.state.id, body);
    }
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  render(){
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <label>
            Title:
            <input name="title" type="text" value={this.state.title} onChange={this.handleChange}/>
          </label> <br />
          <label>
            Text:
            <textarea name="review_text" type="text" cols="45" rows="10"
            value={this.state.review_text} onChange={this.handleChange}></textarea>
          </label>
          <input type="submit" value="Submit"/>

        </form>
      </>
    )
  }
}

 ReviewForm.defaultProps = {
   editReview: {
     id: null,
     title: '',
     review_text: ''
   },
   movieId: null
 }
