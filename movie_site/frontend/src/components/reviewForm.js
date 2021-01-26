import React, {Component} from "react";
import {ServiceFunc} from "../service/serviceFunc";

export class ReviewForm extends Component {

  constructor(props){
    super(props);
    this.auth = new ServiceFunc();
    this.state = {
      title: '',
      review_text: ''
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const body = {
      "title": this.state.title,
      "review_text": this.state.review_text,
      "movie": this.props.movieId
    }
    this.auth.createReview(body);
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  render(){
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <lable>
            Title:
            <input name="title" type="text" value={this.state.title} onChange={this.handleChange}/>
          </lable> <br />
          <lable>
            Text:
            <textarea name="review_text" type="review_text" cols="45" rows="10" value={this.state.review_text} onChange={this.handleChange}></textarea>
          </lable>
          <input type="submit" value="Submit"/>
        </form>
      </>
    )
  }
}
