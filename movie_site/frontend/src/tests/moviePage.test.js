import React from "react";
import {render, screen} from "@testing-library/react";
import {MoviePage} from "../components/moviePage";
import {BrowserRouter as Router} from "react-router-dom";
import {movieList, userMovieRating} from "./fake-data";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect'
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()

const blankUser = {
    id: null,
    username: '',
    isStaff: null
  }

const movie = movieList[0];
const match = { params: { movieId: movie.id}}

beforeEach(() => {
    fetch.mockResponse( req => {
        switch(req.url){
            case `/api/movies/${movie.id}`:
                return Promise.resolve(new Response(JSON.stringify(movie)));
            case `/user_movie_rating/${movie.id}`:
                return Promise.resolve(new Response(JSON.stringify(userMovieRating[0])));
        }
    })
})

test('render movie page', async () => {
    render(
        <Router>
            <MoviePage user={blankUser} loggedIn={false} match={match}/>
        </Router>
    );
    expect(fetch).toHaveBeenCalledWith(`/api/movies/${movie.id}`, {'method': 'GET'});
    expect(await screen.findByRole('heading', {name: new RegExp(movie.title)})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Reviews'})).toBeInTheDocument();
    movie.reviews.forEach(review => {
        expect(screen.getByRole('link', {name: new RegExp(review.title)})).toBeInTheDocument();
    })
    
})

test('render movie page for unauth user (can\'t rate and review)', async () => {
    
    const {container, findByText} = render(
        <Router>
            <MoviePage user={blankUser} loggedIn={false} match={match}/>
        </Router>
    );
    expect(await findByText('Loading...')).not.toBeInTheDocument();
    expect(container).not.toHaveClass('auth-footer');
})

test('render movie page for non admin unauth user (can\'t delete and approve review)', async () => {
    
    render(
        <Router>
            <MoviePage user={blankUser} loggedIn={false} match={match}/>
        </Router>
    );
    expect(await screen.findByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Delete'})).toBeNull();
    expect(screen.queryByRole('button', {name: 'Approve'})).toBeNull();
})