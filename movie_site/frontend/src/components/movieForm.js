import React, {Component} from "react";
import {ServiceFunc} from "../service/serviceFunc";
import {Form ,FormGroup, Button, Input, Label} from "reactstrap";

export default class MovieForm extends Component {

  constructor(props){
    super(props);
    this.service = new ServiceFunc()
    this.state = {
      staff: [],
      genres: [],
      countries: [],
      movie: {
        title: '',
        year: null,
        director: [],
        actors: [],
        writers: [],
        genres: [],
        countries: [],
        plot: ''
      }

    }
  }


  componentDidMount(){
    this.service.getAllStaff().then(data => {
      this.setState({staff:data})
    })

    this.service.getCountries().then(data => {
      this.setState({countries: data})
    })

    this.service.getGenres().then(data => {
      this.setState({genres: data})
    })
  }

  elemInfo = (elem, info) => {
    return (
      <div >
        <Label check>
          <Input data-spec={info} name={elem.name} type="checkbox" value={elem.id}
          onChange={this.handleChange}/>
          {elem.name}
        </Label>
      </div>
    )
  }

  handleChange = event => {
    const {movie} = this.state;
    const {spec} = event.target.dataset;
    const {value} = event.target;
    if (event.target.checked) {
      movie[spec].push(value);
    } else {
      const index = movie[spec].indexOf(value);
      movie[spec].splice(index, 1);
    }
    this.setState({movie});
  }

  handleInputChange = event => {
    const {movie} = this.state;
    movie[event.target.name] = event.target.value;
    this.setState({movie})
  }

  handleSubmit = event => {
    event.preventDefault();
    this.service.addMovie(this.state.movie);
  }


  render() {


    return (
      <div className="movie-form-page">
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for='titleId'>Title:</Label>
            <Input name='title' type='text' id='titleId' onChange={this.handleInputChange}/>
          </FormGroup>
          <FormGroup>
            <Label for='yearId'>Date:</Label>
            <Input name='year' id='yearId' type='date'onChange={this.handleInputChange}/>
          </FormGroup>

          {["Director", "Actors", "Writers"].map(role => {
            return (
                <FormGroup>
                  {role}
                  <FormGroup id={role} className='selectMovieInfo' check>
                    {this.state.staff.map(staff =>{
                      return (
                        <div>
                          <Label check>
                            <Input data-spec={role.toLowerCase()} name={`${staff.name} ${staff.surname}`} type='checkbox'
                            value={staff.id} onChange={this.handleChange}/>
                            {staff.name} {staff.surname}
                          </Label>
                        </div>
                      )
                    })}
                  </FormGroup>
                </FormGroup>
            )
          })}

          <FormGroup>
          Genres:
          <FormGroup className='selectMovieInfo' check>
          {this.state.genres.map(genre =>{
            return this.elemInfo(genre, 'genres')
          })}
          </FormGroup>
          </FormGroup>

          <FormGroup>
          Countries:
          <FormGroup className='selectMovieInfo' check>
          {this.state.countries.map(country =>{
            return this.elemInfo(country, 'countries')
          })}
          </FormGroup>
          </FormGroup>


          <FormGroup>
          Plot:
          <Input type="textarea" name='plot'
          value={this.state.movie.plot}
          onChange={this.handleInputChange} />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </div>
    )
  }
}
