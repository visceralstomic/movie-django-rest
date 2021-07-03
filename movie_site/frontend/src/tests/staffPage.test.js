import React from "react";
import {render, screen, within} from "@testing-library/react";
import StaffPage from "../components/staffPage";
import {BrowserRouter as Router} from "react-router-dom";
import {staff, blankStaff} from "./fake-data";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';
import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks()


const match = { params: { staffId: staff.id}};
const match2 = { params: { staffId: blankStaff.id}};

beforeEach(() => {
    fetch.mockResponse( req => {
        switch(req.url){
            case `/api/staff/${staff.id}`:
                return Promise.resolve(new Response(JSON.stringify(staff)));
            case `/api/staff/${blankStaff.id}`:
                return Promise.resolve(new Response(JSON.stringify(blankStaff)));
        }
    })
})


test('render staff page (all staff\'s roles are full)', async () => {
    render(
        <Router>
            < StaffPage match={match} />
        </Router>
    );

    expect(fetch).toHaveBeenCalledWith(`/api/staff/${staff.id}`, {'method': 'GET'});
    expect(await screen.findByRole('heading', {name: `${staff.name} ${staff.surname}`}));
    expect(
        within(screen.getByRole('heading', {name: 'Director'}).closest('ul')).getAllByRole('link')
    ).toHaveLength(staff.director.length)
    expect(
        within(screen.getByRole('heading', {name: 'Actor'}).closest('ul')).getAllByRole('link')
    ).toHaveLength(staff.actors.length)
    expect(
        within(screen.getByRole('heading', {name: 'Writer'}).closest('ul')).getAllByRole('link')
    ).toHaveLength(staff.writers.length)

})

test('render staff page (all staff\'s roles are empty)', async () => {
    render(
        <Router>
            < StaffPage match={match2} />
        </Router>
    );

    expect(fetch).toHaveBeenCalledWith(`/api/staff/${blankStaff.id}`, {'method': 'GET'});
    expect(await screen.findByRole('heading', {name: `${blankStaff.name} ${blankStaff.surname}`}));
    expect(screen.getAllByText(/No entries in that role/i)).toHaveLength(3); 

})
