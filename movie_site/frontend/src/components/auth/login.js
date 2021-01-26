import React, {Component} from "react";
import {AuthFunc} from "../../service/serviceFunc";
import {Redirect} from "react-router-dom";

export default class Login extends Component{

  constructor(props){
    super(props);
    this.auth = new AuthFunc();
    this.loggedIn = this.props.loggedIn;
    this.state = {
      username:'',
      password:'',
      redirect: false
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    this.auth.loginUser(this.state.username, this.state.password)
      .then(res =>{
        console.log(res)
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        this.loggedIn(true, this.state.username);
        this.setState({redirect: true});
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
        {this.state.redirect ? <Redirect to="/" />
        :<div>
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
        </div>
      }
      </>
    )
  }
}
