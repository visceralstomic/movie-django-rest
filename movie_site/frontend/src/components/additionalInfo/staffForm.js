import React, {Component} from "react";
import {ServiceFunc} from "../../service/serviceFunc";
import {Form, FormGroup, Button, Label, Input, Col} from "reactstrap";

export default class StaffForm extends Component {
    constructor(props){
        super(props);
        this.service = new ServiceFunc();
        this.state = {
            name: '',
            surname: ''
        }
    }

    handleSubmit = event =>{
        event.preventDefault();
        const body = {
            name: this.state.name,
            surname: this.state.surname
        }
        this.service.addStaff(body).then(res=>{
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    handleChange = event =>{
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
            <h3>Create new person</h3>
            <Form onSubmit={this.handleSubmit}>
                <FormGroup row>
                    <Label for="nameId" sm={3}>Name:</Label>
                    <Col sm={9}>
                        <Input id="nameId" value={this.state.name} name="name" onChange={this.handleChange} />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="surnameId" sm={3}>Surname:</Label>
                    <Col sm={9}>
                        <Input id="surnameId" value={this.state.surname} name="surname"onChange={this.handleChange} />
                    </Col>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={{ offset: 4}}>
                        <Button>Submit</Button>
                    </Col>
                </FormGroup>
            </Form>
            </div>
            
        )
    }
}