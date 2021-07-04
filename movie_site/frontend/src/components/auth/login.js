import React, {Component} from "react";
import {UserFunc} from "../../service/serviceFunc";
import {Redirect} from "react-router-dom";
import {Input, Button, Form, FormGroup, Label, Col, FormText} from "reactstrap";

export default class Login extends Component{

  constructor(props){
    super(props);
    this.auth = new UserFunc();
    this.loggedIn = this.props.loggedIn;
    this.state = {
      username:'',
      password:'',
      redirect: false,
      error: ''
    }
  }

  validForm = ({username, password}) => {
    return username.trim() !== "" && password.trim() !== ""
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.validForm(this.state)) {
      this.auth.loginUser(this.state.username, this.state.password)
      .then(res =>{
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        this.loggedIn(true);
        this.setState({redirect: true});
      })
      .catch(error => {
        if (error.message === 'Unauthorized'){
          this.setState({error: 'Invalid password or login'})
        }
        console.log(error)
      })
    } else {
      this.setState({ error: 'You must fill both filds'})
    }
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value })
  }

  render(){
    const {error} = this.state;
    return (
      <>
        {this.state.redirect ? <Redirect to="/" />
        :<div className="login-area">
            <h2>Login</h2>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Label for="username" sm={2}>Username: </Label>
                <Col sm={10}>
                  <Input name="username" type='text' value={this.state.username} onChange={this.handleChange}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="password" sm={2}>Password: </Label>
                <Col sm={10}>
                  <Input name="password" type='password' value={this.state.password} onChange={this.handleChange}/> 
                </Col>
              </FormGroup>
              {error.length !== 0 ? 
              <FormGroup row>
                <Col sm={{offset: 3}}><span className="error-message">{error}</span></Col>
              </FormGroup>: null}
              <FormGroup check row>
                <Col>
                  <Button>Login</Button>
                </Col>
              </FormGroup>
            </Form>
        </div>}
      </>
    )
  }
}
