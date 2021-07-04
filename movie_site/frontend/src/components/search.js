import React, {Component} from "react";
import {ServiceFunc} from "../service/serviceFunc";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {Input} from "reactstrap";



const SearchWrap = styled.div`
    width: 500px;
    input {
        border: 1px solid grey;
        width: inherit;
        padding: 0.5rem;
    }

`

const SearchResult = styled.div`
    border: 1px solid grey;
    border-top-width: 0;
    border-bottom-width: 0;
    margin-top: 0;
    width: 500px;
    background-color: black;
    color: white;
    position: absolute;
    z-index: 1;
`

const SearchList = styled.ul`
    list-style: none; 
    overflow-y: auto;
    max-height: 150px;
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 18px;
`

const SearchListItem = styled.li`
    padding-left: 15px;
    padding-top: 5px;
    padding-bottom: 5px;
    border: 1px solid grey;
    border-bottom: none;
    transition: 300ms ease-in-out; 
    &:hover {
        font-size: 22px;
        background-color: #5F5F5F;
    }        
` 
const ListTitle = styled.div`
    font-size: 25px;
    padding: 3px 3px 3px 5px;
    color: black;
    background-color: white; 
`
const StyledLink = styled(Link)`
    text-decoration: none;
    color: white;
    margin: 0;
    display: block;
    width: 100%;
    height: 100%;
    &:hover {
        text-decoration: none;
        color: white;
    } 
` 

const NoResultsBlock = styled.div`
    font-size: 17px;
    .no-result {
        font-style: italic;
        padding: 3px 3px 3px 10px;
    } 
`


export default class SearchPanel extends Component {
    constructor(props){
        super(props);
        this.service = new ServiceFunc();
        this.state = {
            activate: false,
            staffSearchResults: [],
            moviesSearchResults: []
        }
    }

    handleClick = event =>{
        this.setState({activate: false});
    }

    handleChange = event =>{
        setTimeout(() => {this.service.search({
            search_qry: event.target.value
        }).then(res => {
            this.setState({
                activate: res.empty ? false : true,
                staffSearchResults: res.staff || [],
                moviesSearchResults: res.movies || []
            })
        }).catch(err => {
            console.log(err);
        })}, 500)
    }

    createResultComponent = (resultList, title, path, getElemData) => {
        let resultComponent=null;
        if (resultList.length){
            resultComponent = (
                <>
                    <ListTitle>{title}</ListTitle>
                    <SearchList>
                    {resultList.map((elem, idx) => {
                        return (
                            <SearchListItem key={idx}>
                                <StyledLink className='search-link' 
                                onClick={this.handleClick} to={`/${path}/${elem.id}`}>{
                                 getElemData(elem)}
                                </StyledLink>
                            </SearchListItem>
                        )
                    })}
                    </SearchList>
                </>
            )
        } else {
            resultComponent=(
                <NoResultsBlock>
                    <ListTitle>{title}</ListTitle>
                    <div className="no-result">No results were found</div> 
                </NoResultsBlock>
            )
        }
        return resultComponent;
    }

    formatDate = date =>{
        return Intl.DateTimeFormat("en-US", {
            year: "numeric"
        }).format(new Date(date));
    }
    render() {
       
        const {staffSearchResults, moviesSearchResults, activate} = this.state;
        let staffSearchResultComponent = this.createResultComponent(staffSearchResults,
                                                                    "Persons",
                                                                    "staff",
                                                                    (elem)=>(<>{elem.name} {elem.surname}</>) );
        let movieSearchResultComponent = this.createResultComponent(moviesSearchResults,
                                                                    "Movies",
                                                                    "movie",
                                                                    (elem)=>{
                                                                        return (
                                                                        <>
                                                                            {elem.title} ({this.formatDate(elem.year)})
                                                                        </>) 
                                                                    });;
    
        return (
            <SearchWrap>
                <Input type="text" placeholder="Search" 
                    onChange={this.handleChange}/>
                {activate ? <SearchResult>
                    {movieSearchResultComponent}
                    {staffSearchResultComponent}
                </SearchResult> : null}
            </SearchWrap>
        )
    }
}