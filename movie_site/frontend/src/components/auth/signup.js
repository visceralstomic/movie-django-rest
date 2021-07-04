import React, {Component} from 'react';
import {UserFunc} from "../../service/serviceFunc"
import {Redirect} from "react-router-dom";
import {Form, Button, FormGroup, Input, Col} from "reactstrap";

export default class SignUp extends Component{
  constructor(props){
    super(props);
    this.uservice = new UserFunc();
    this.state = {
      data: {
        username:'',
        password:'',
        password2: '',
        email: '',
      },
      redirect: false,
      errors: {
        username:'',
        password:'',
        password2: '',
      }      
    }
  }

  handleChange = event => {
    const {name, value}= event.target;
    this.setState(prevState => ({
      data: {
        ...prevState.data,
        [name]: value
      }
    }));
  }

  validateForm = formData => {
    const {username, password, password2} = formData;
    let errorStatus = false;
    if (!username.trim()) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          username: "Username required"
        }
      }))
      errorStatus = true;
    }

    if (!password.trim()) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          password: "This field must not be blank"
        }
      }))
      errorStatus = true;
    }

    if (!password2.trim()) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          password2: "This field must not be blank"
        }
      }))
      errorStatus = true;
    }

    if (password.trim() !== password2.trim()) {
      this.setState(prevState => ({
        errors: {
          ...prevState.errors,
          password2: "Passwords fields must match"
        }
      }))
      errorStatus = true;
    }
    return errorStatus; 
  }

  handleSubmit = event => {
    event.preventDefault();
    const {data } = this.state;
    if(!this.validateForm(data)) {
      this.uservice.registerUser(data).then(() => {
        this.setState({redirect: true});
      }).catch(error => {
        console.log(error);
      });
    }
    
  }
  

  render(){
    const {errors} = this.state;
    return (
        <>
          {this.state.redirect 
          ?<Redirect to="/login/" />
          :<div className="reg-area">
            <h2>Registration</h2>
            <div className="reg-form">
              <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Input name="username" type="text" placeholder="Enter username"
                  value={this.state.data.username}  onChange={this.handleChange} />
                  {errors.username.length > 0 && <span className="error-message">{errors.username }</span> }
                  </FormGroup>

                  <FormGroup>
                    <Input name="password" type="password" placeholder="Enter password"
                    value={this.state.data.password}  onChange={this.handleChange} /> 
                    {errors.password.length > 0 && <span className="error-message" >{errors.password }</span> }
                  </FormGroup>

                  <FormGroup>
                    <Input name="password2" type="password" placeholder="Confirm password"
                    value={this.state.data.password2}  onChange={this.handleChange} /> 
                    {errors.password2.length > 0 && <span className="error-message">{errors.password2 }</span> }
                  </FormGroup>

                  <FormGroup>
                    <Input name="email" type="email" placeholder="Enter email"
                    value={this.state.data.email}  onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup check row >
                      <Col sm={{ size: 10, offset: 3}}>
                        <Button>Submit</Button>
                      </Col>
                  </FormGroup>
              </Form>
            </div>
          </div>}
        </>
    )
  }
}
