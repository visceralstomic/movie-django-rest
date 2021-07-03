import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {ServiceFunc} from "../service/serviceFunc";
import {ReviewForm} from "./reviewForm"
import {Redirect} from "react-router-dom";
import {Card, Button, CardTitle, CardBody, CardText, CardHeader} from "reactstrap";


export default class SinglReviewPage extends Component {
  constructor(props){
    super(props);
    this.service = new ServiceFunc();
    this.reviewId = this.props.match.params.reviewId;
    this.state = {
      id: null,
      title: null,
      created: null,
      author: {},
      review_text: null,
      movie: {},
      edit: false,
      redirect: false
    }
  }

  componentDidMount(){
    this.service.getReview(this.reviewId)
      .then(data => {
        this.setState({...data})})
      .catch(error=>{
        console.log(error);
      })
  }

  handleEditReview = event => {
    this.setState({edit: true})
  }

  editReview = (data) =>{
    this.setState((state) => {
      return {
        ...state,
        title: data.title,
        review_text: data.review_text,
        edit: false
      }
    })
  }

  cancelEdit = event => {
    this.setState({edit: false})
  }

  deleteReview = event => {
    this.service.deleteReview(this.state.id).then(
      () => this.setState({redirect: true})
      ).catch(err => console.log(err))
  }

  formatRevDate = created => {
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month:'numeric',
      day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
    }).format(created)
  }


  render(){
    const {id, title, author, created, review_text, movie} = this.state;
    const {user} = this.props;
    if(this.state.redirect){
      return <Redirect to={`/movie/${movie.id}`} />
    } else {
      return (
        <div className="review-area">
          <Card>
            <CardHeader><h2 className='review-mv-title'><Link to={`/movie/${movie.id}`}>{movie.title}</Link></h2></CardHeader>
            <CardBody>
            { !this.state.edit
              ?<>
                <CardTitle tag="h5">
                  <span className="review-title">{title}</span> by {author.username}, {this.formatRevDate(new Date(created))}
                </CardTitle>
                <CardText>{review_text}</CardText>
                {user.id == author.id
                ? <div className="form-button">
                    <Button color="success" onClick={this.handleEditReview}>Edit</Button>
                    <Button color="danger" onClick={this.deleteReview}>Delete</Button>
                  </div>
                : null }
              </>
              :<>
              <ReviewForm reviewToEdit={{id: id, title: title, review_text: review_text }} 
                editReview={this.editReview} cancelEdit={this.cancelEdit}/>
              
              </>
            }
          </CardBody>
          </Card>
  
        </div>
      )
    }
  }
}
