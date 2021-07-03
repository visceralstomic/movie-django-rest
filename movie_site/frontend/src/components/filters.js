import React, { Component } from "react";
import {ServiceFunc} from "../service/serviceFunc";
import { Button, Container, Row, Col, ListGroup, ListGroupItem, ButtonGroup} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

export default class Filters extends Component {
    constructor(props){
        super(props);
        this.service = new ServiceFunc();
        this.getMovies = props.getMovies;
        this.loggedIn = this.props.loggedIn; 
        this.state = {
            countries: [],
            genres: [],
            filter: '',
            ordrIsActvd: null,
            orderBtn: {
                year: '', // '' - asc, '-' - desc
                title: '',
                num_of_ratings: '',
                avg_rating: '',
            }
        }
    }

    componentDidMount(){
        this.service.getGenres(this.loggedIn).then(data =>{
            this.setState({genres: data})
        }).catch(err => {
            console.log(err)
        })
        this.service.getCountries(this.loggedIn).then(data =>{
            this.setState({countries: data})
        }).catch(err => {
            console.log(err)
        })
    }

    handleFilter = filter => event => {
        this.setState({filter: filter + "&", ordrIsActvd: null})
        this.getMovies("?" + filter)
    }

    handleOrder = event => {
        const {value} = event.currentTarget;
        const {orderBtn} = { ...this.state};
        const curBtn = orderBtn;
        curBtn[value] = curBtn[value] === '' ? '-' : '';
        this.setState({ordrIsActvd: value, orderBtn: curBtn })
        this.getMovies(`?${this.state.filter}ordering=${this.state.orderBtn[value]}${value}`)
    }

    renderSortIndicator = (orderStatus, orderValue, orderName) => {
 
        return orderStatus === orderName && orderValue === ''
            ? <FontAwesomeIcon icon={faSortUp} /> 
            : orderStatus === orderName && orderValue === '-'
            ? <FontAwesomeIcon icon={faSortDown} />
            : <FontAwesomeIcon icon={faSort}  />
    }

    render() {
        const {countries, genres, ordrIsActvd} = this.state;
        const {orderBtn: {year, title, num_of_ratings, avg_rating}} = this.state;

        return (
            <div className="filter-wrap">
                <Container >
                    <Row>
                        <Col>
                        <ButtonGroup>
                                    <Button style={{ backgroundColor: "#232323"}}
                                    value="year" 
                                    onClick={this.handleOrder}>
                                        Year {this.renderSortIndicator(ordrIsActvd, year, "year")}
                                    </Button> <br />

                                    <Button style={{ backgroundColor: "#232323"}}
                                    value="title" 
                                    onClick={this.handleOrder}>
                                        Title {this.renderSortIndicator(ordrIsActvd, title, "title")}
                                    </Button>

                                    <Button style={{ backgroundColor: "#232323"}}
                                    value="avg_rating" 
                                    onClick={this.handleOrder}>
                                        Average rating {this.renderSortIndicator(ordrIsActvd, avg_rating, "avg_rating")}
                                    </Button><br />

                                    <Button style={{ backgroundColor: "#232323"}}
                                    value="num_of_ratings" 
                                    onClick={this.handleOrder}>
                                        Number of ratings {this.renderSortIndicator(ordrIsActvd, num_of_ratings, "num_of_ratings")}
                                    </Button>
                        </ButtonGroup>
                        </Col>
                    </Row>

                        <Row>
                            <Col >
                            <div >
                                <h5>Countries</h5>
                                <ListGroup  className='filter-list'> 
                                    {countries.map((country, idx) => {
                                        return (
                                            <ListGroupItem 
                                             key={idx} tag="button"
                                             color={this.state.filter.includes(country.name)  ? "dark" : "secondary" }
                                             onClick={this.handleFilter(`country=${country.name}`)} action>
                                                    {country.name}
                                            </ListGroupItem>
                                        )
                                    })}
                                </ListGroup>
                            </div>
                            </Col>

                            <Col >
                            <div>
                                <h5>Genres</h5>
                                <ListGroup className='filter-list'>
                                    {genres.map((genre, idx) => {
                                        return (
                                            <ListGroupItem 
                                            key={idx} tag="button" 
                                            color={this.state.filter.includes(genre.name)  ? "dark" : "secondary" }
                                             onClick={this.handleFilter(`genre=${genre.name}`)} action>
                                                    {genre.name}
                                            </ListGroupItem>
                                        )  
                                    })}
                                </ListGroup>
                            </div>
                            </Col>
                        </Row>

            </Container >  
            </div>
        )
    }
}

