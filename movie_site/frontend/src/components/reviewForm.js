import React, {Component} from "react";
import {ServiceFunc} from "../service/serviceFunc";
import {Button, Form, FormGroup, Label, Input} from "reactstrap";

export class ReviewForm extends Component {

  constructor(props){
    super(props);
    this.service = new ServiceFunc();
    this.state = {...this.props.reviewToEdit}
    this.cancelEdit = this.props.cancelEdit;
    this.editReview = this.props.editReview;
  }

  handleSubmit = event => {
    event.preventDefault();
    const body = {
      "title": this.state.title,
      "review_text": this.state.review_text
    }
    if (this.state.id === null) {
      this.service.createReview({...body,"movie": this.props.movieId})
    } else {
      this.service.editReview(this.state.id, body);
      this.editReview(body);
    }
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  render(){

    return (
      <div className="review-form">
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="titleId">Title</Label>
            <Input name="title" type="text" id='titleId' value={this.state.title} onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup>
            <Label for="textId">Text</Label>
            <Input name="review_text" type="textarea" cols="45" rows="10" id='textId'
            value={this.state.review_text} onChange={this.handleChange}/>
          </FormGroup>
          <div className="form-button">
          <Button color="success">Submit</Button>
          {this.cancelEdit ? <Button color="secondary" onClick={this.cancelEdit}>Cancel</Button>: null}
          </div>
        </Form>
      </div>
    )
  }
}

 ReviewForm.defaultProps = {
  reviewToEdit: {
     id: null,
     title: '',
     review_text: ''
   },
   movieId: null
 }
