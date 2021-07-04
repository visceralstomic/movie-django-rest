import React, {Component, component} from "react";
import {UserFunc} from "../../service/serviceFunc";
import {Form, Input, Label, Button, FormGroup} from "reactstrap";


export default class ProfileForm extends Component {
    constructor(props){
        super(props);
        this.uservice = new UserFunc();
        this.uid = this.props.uid;
        this.state = {...this.props.profile};
        this.editProfile = this.props.editProfile;
        this.cancelEdit = this.props.cancelEdit;
    }

    handleInput = event => {
        this.setState({[event.target.name]: event.target.value})
    }

    handleImage = event => {
        this.setState({[event.target.name]: event.target.files[0]})
    }

    handleSubmit = event => {
        event.preventDefault();
        const {first_name, last_name, email, photo} = this.state;
        const form = new FormData();
        form.append("first_name", first_name);
        form.append("last_name", last_name);
        form.append("email", email);
        if (typeof photo !== "string") form.append("photo", photo, photo.name);
        this.uservice.updateUser(this.uid, form).then(
            res => {
                this.editProfile({
                    first_name: res.first_name,
                    last_name: res.last_name,
                    email: res.email,
                    photo: res.photo
                })
            }
        ).catch(
            error => {
                console.log(error)
            }
        );
    }


    render(){
        return (
            <>
                <h2>Edit profile</h2>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="firstNameInput">First name</Label>
                        <Input name="first_name" onChange={this.handleInput} type="text"
                         id="firstNameInput"  value={this.state.first_name} />
                    </FormGroup>
                    
                    <FormGroup>
                        <Label for="lastNameInput">Last name</Label>
                        <Input name="last_name" onChange={this.handleInput} type="text"
                         id="lastNameInput"  value={this.state.last_name} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="emailInput">Email</Label>
                        <Input name="email" onChange={this.handleInput} type="email"
                         id="emailInput"  value={this.state.email} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="photoInput">Photo</Label>
                        <Input name="photo" onChange={this.handleImage} type="file"
                         id="photoInput" accept="image/*"  />
                    </FormGroup>

                    <Button>Submit</Button>
                    <Button onClick={this.cancelEdit}>Cancel</Button>                   
                </Form>
            </>
        )
    }

}
