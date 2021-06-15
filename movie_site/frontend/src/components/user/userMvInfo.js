import React, {Component} from "react";
import {UserFunc} from "../../service/serviceFunc";
import {Link} from "react-router-dom"; 
import {Button, Container, Row, Col, ListGroup, ListGroupItem,
    Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import ProfileForm from "./profileForm";
import classnames from "classnames";

export default class UserMvInfo extends Component {
    constructor(props){
        super(props);
        this.uservice = new UserFunc();
        this.uid = this.props.uid;
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            photo: '',
            ratings: [],
            reviews:[],
            avgRate: "",
            numOfWtchd: "",
            edit: false,
            activeTab: '1'
        };
    }

    componentDidMount(){
        this.uservice.getUserPage(this.uid).then(res => {
            this.setState({
                first_name: res.first_name,
                last_name: res.last_name,
                email: res.email,
                photo: res.photo,
                ratings: res.ratings,
                reviews: res.reviews
            })
        })

        this.uservice.getUserStats().then(res => {
            this.setState({
                avgRate: res.avg_rating,
                numOfWtchd: res.num_of_watched
            })
        })
    }

    handleEdit = () =>{
        this.setState({edit: true})
    }

    cancelEdit = () => {
        this.setState({edit: false});
    }

    editProfile = data => {
        this.setState({...data, edit: false})
    }

    toggle = tab => {
        if (this.state.activeTab !== tab ) this.setState({ activeTab: tab})
    }

    render(){
        const {last_name, first_name, email, photo, ratings, reviews, avgRate, numOfWtchd, edit, activeTab} = this.state;
        
        return (
            <div className="user-info">  
                {!edit 
                 ?<Container>
                    <Row>
                        <Col xs="3">
                            <img src={photo} />
                        </Col>

                        <Col xs="5">
                            <h5>First name: {first_name} </h5>
                            <h5>Last name: {last_name} </h5>
                            <h5>Email: {email} </h5>
                            <h5>Average rating: {Math.round(avgRate*100)/100} </h5>
                            <h5>Watched movies: {numOfWtchd} </h5>
                            <Button onClick={this.handleEdit} color="primary">Edit profile</Button>
                        </Col>
                    </Row>
                 </Container>
                 : <ProfileForm uid={this.uid} 
                    profile={{last_name:last_name, first_name:first_name, email:email, photo: photo }}
                    cancelEdit={this.cancelEdit} editProfile={this.editProfile}/> }
                <div className="user-nav-link user-nav" >
                    <Nav tabs>
                        <NavItem>
                            <NavLink className={classnames({ active: activeTab === "1"})}
                                    onClick={ () => this.toggle('1')}>
                                        Ratings
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({ active: activeTab === "2"})}
                                    onClick={ () => this.toggle('2')}>
                                        Reviews
                            </NavLink>
                        </NavItem>
                    </Nav>
                </div>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <ListGroup className="user-nav-list">
                            {ratings.map(elem=>{
                                return (
                                    <ListGroupItem key={elem.mark} 
                                      tag={Link} to={`/movie/${elem.movie.id}`} action>
                                        {elem.movie.title} | Rating: {elem.mark}
                                    </ListGroupItem>
                                )
                            })}
                        </ListGroup>
                    </TabPane>
                    <TabPane tabId="2">
                        <ListGroup className="user-nav-list">
                            {reviews.map(elem=>{
                                return (
                                    <ListGroupItem key={elem.id} 
                                      tag={Link} to={`/review/${elem.id}`} action>
                                        {elem.title} | (for {elem.movie.title})
                                    </ListGroupItem>
                                )
                            })}
                        </ListGroup>
                    </TabPane>
                </TabContent>
            </div>
        )
    }
}
