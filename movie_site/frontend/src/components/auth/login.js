import React, {Component} from "react";
import {AuthFunc} from "../../service/serviceFunc";


export default class Login extends Component{

  constructor(props){
    super(props);
    this.auth = new AuthFunc();
    this.state = {
      username:'',
      password:''
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    this.auth.loginUser(this.state.username, this.state.password)
      .then(res =>{
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
      })
      .catch(error => {
        console.log(error)
      })
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value })
  }

  render(){
    return (
      <>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input name="username" type='text' value={this.state.username} onChange={this.handleChange}/>
          </label>
          <label>
            Password:
            <input name="password" type='password' value={this.state.password} onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
      </>
    )
  }
}
