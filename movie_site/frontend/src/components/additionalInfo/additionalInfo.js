import React, {Component} from "react";
import StaffForm from "./staffForm";
import GenreForm from "./genreForm";
import CountryForm from "./countryForm";
import { Container, Row, Col } from "reactstrap";
export default class AdditionalInfo extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div >
                <h2 className='add-title'>Additional movie info</h2>
                <Container>
                    <Row>
                        <Col>
                        <StaffForm />
                        </Col>
                        <Col>
                        <GenreForm />
                        </Col>
                        <Col>
                        <CountryForm />
                        </Col>
                    </Row>
                </Container>  
            </div >
        )
    }
} 
