import React, {Component} from "react";
import {ServiceFunc} from "../../service/serviceFunc";
import {Form, FormGroup, Button, Label, Input, Col} from "reactstrap";

export default class GenreForm extends Component {
    constructor(props){
        super(props);
        this.service = new ServiceFunc();
        this.state = {
            name: ''
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        const body = {
            name: this.state.name
        }
        this.service.addGenre(body).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    }
    

    render() {
        return (
            <div>
            <h3>Create new genre</h3>
            <Form onSubmit={this.handleSubmit}>
                <FormGroup row>
                    <Label for="nameId" sm={2}>Name:</Label>
                    <Col sm={10}>
                        <Input id="nameId" name="name" value={this.state.name} onChange={this.handleChange} />
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