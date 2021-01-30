import React, {Component} from "react";
import {ServiceFunc} from "../service/serviceFunc";


export default class MovieForm extends Component {

  constructor(props){
    super(props);
    this.auth = new ServiceFunc()
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
    this.auth.getAllStaff().then(data => {
      this.setState({staff:data})
    })

    this.auth.getCountries().then(data => {
      this.setState({countries: data})
    })

    this.auth.getGenres().then(data => {
      this.setState({genres: data})
    })
  }

  elemInfo = (elem, info) => {
    return (
      <div >
        <label>
          <input data-spec={info} name={elem.name} type="checkbox" value={elem.id}
          onChange={this.handleChange}/>
          {elem.name}
        </label>
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
    console.log(spec, this.state.movie[spec])
  }

  handleInputChange = event => {
    const {movie} = this.state;
    movie[event.target.name] = event.target.value;
    this.setState({movie})
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state.movie)
    this.auth.addMovie(this.state.movie)
  }


  render() {


    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <label>
            Title:
            <input name='title' type='text' onChange={this.handleInputChange}/>
          </label> <br />
          <label>
            Year:
            <input name='year' type='number' onChange={this.handleInputChange}/>
          </label> <br />

          {["Director", "Actors", "Writers"].map(role => {
            return (
                <>
                  {role}
                  <div className='selectMovieInfo'>
                    {this.state.staff.map(staff =>{
                      return (
                        <div>
                        <label>
                          <input data-spec={role.toLowerCase()} name={`${staff.name} ${staff.surname}`} type='checkbox'
                          value={staff.id} onChange={this.handleChange}/>
                          {staff.name} {staff.surname}
                        </label>
                        </div>
                      )
                    })}
                  </div>
                </>
            )
          })}


          Genres:
          <div className='selectMovieInfo'>
          {this.state.genres.map(genre =>{
            return this.elemInfo(genre, 'genres')
          })}
          </div>

          Countries:
          <div className='selectMovieInfo'>
          {this.state.countries.map(country =>{
            return this.elemInfo(country, 'countries')
          })}
          </div>

          Plot:
          <textarea name='plot' rows="10" cols="45"
          value={this.state.movie.plot}
          onChange={this.handleInputChange}></textarea><br />

          <input type="submit" value="Submit"/>
        </form>
      </>
    )
  }
}
