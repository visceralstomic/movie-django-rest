import React from "react";
import {render, screen} from "@testing-library/react";
import SinglReviewPage from "../components/singlReviewPage";
import {BrowserRouter as Router} from "react-router-dom";
import {review} from "./fake-data";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect'
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()


const blankUser = {
    id: null,
    username: '',
    isStaff: null
  }

const match = { params: { reviewId: review.id}}



beforeEach(() => {
    fetch.mockResponse( req => {
        switch(req.url){
            case `/api/movies/reviews/${review.id}`:
                return Promise.resolve(new Response(JSON.stringify(review)));
        }
    })
})


test('render review page', async () => {
    render(
        <Router>
            <SinglReviewPage user={blankUser} match={match}/>
        </Router>
    );

    expect(fetch).toHaveBeenCalledWith(`/api/movies/reviews/${review.id}`, {'method': 'GET'});
    expect(await screen.findByRole('heading', {name: new RegExp(review.title)}) );
})

test('render review page for unauth (only can read)', async () => {
    render(
        <Router>
            <SinglReviewPage user={blankUser} match={match}/>
        </Router>
    );

    expect(await screen.findByRole('button', {name: 'Delete'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Edit'})).toBeNull();
})