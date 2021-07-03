import React from 'react';
import {render, screen} from "@testing-library/react";
import { HomePage } from "../components/homePage";
import {BrowserRouter as Router} from "react-router-dom";
import {movieList, genres, countries} from "./fake-data";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect'
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()


const fetchParams = {
  'method': "GET", 
  'headers': {
    'Authorization': "JWT null"
}}

beforeEach(() => {
  fetch.mockResponse( req => {
    switch(req.url) {
      case '/api/movies/':
        return Promise.resolve(new Response(JSON.stringify(movieList)));
      case '/api/admin/genres/':
        return Promise.resolve(new Response(JSON.stringify(genres)));
      case '/api/admin/countries/':
        return Promise.resolve(new Response(JSON.stringify(countries)));
      case '/api/movies/?genre=Animation':
        return Promise.resolve(new Response(JSON.stringify(
          movieList.filter(elem => 
            elem.genres.map(genre => genre.name).includes('Animation'))
        )));
      case '/api/movies/?country=USA':
        return Promise.resolve(new Response(JSON.stringify(
          movieList.filter(elem => 
            elem.countries.map(country => country.name).includes('USA'))
        )));
      case '/api/movies/?ordering=avg_rating':
        return Promise.resolve(new Response(JSON.stringify(
          [...movieList].sort((a,b) => parseFloat(a.avg_rating) - parseFloat(b.avg_rating))
        )));
      case '/api/movies/?ordering=-avg_rating':
        return Promise.resolve(new Response(JSON.stringify(
          [...movieList].sort((a,b) => parseFloat(b.avg_rating) - parseFloat(a.avg_rating))
        )));
    }
  });
})

  
test('render movie list', async () => {
    render(<Router>
      <HomePage />
    </Router>)
    expect(fetch).toHaveBeenCalledWith('/api/movies/', {'method': 'GET'});
    expect(await screen.findAllByRole('link')).toHaveLength(2);
    movieList.map(elem => elem.title).forEach(title => {
      expect(screen.getByRole('heading', {name: title})).toBeInTheDocument();
    });

});

test('render filters (genres)', async () => {
  render(
    <Router>
      <HomePage />
    </Router>
  )
  
  expect(fetch).toHaveBeenCalledWith('/api/admin/genres/', fetchParams);
  expect(await screen.findByRole('heading', {name: 'Genres'})).toBeInTheDocument();
  genres.map(elem => elem.name).forEach(elem => {
    expect(screen.getByRole('button', {name: elem})).toBeInTheDocument();
  });
});


test('render filters (countries)', async () => {
  render(
    <Router>
      <HomePage />
    </Router>
  )  
  
  expect(fetch).toHaveBeenCalledWith('/api/admin/countries/', fetchParams);
  expect(await screen.findByRole('heading', {name: 'Countries'})).toBeInTheDocument();
  countries.map(elem => elem.name).forEach(elem => {
    expect(screen.getByRole('button', {name: elem})).toBeInTheDocument();
  });

});

test('render order buttons', async () => {
  render(
    <Router>
      <HomePage />
    </Router>
  );  
  expect(await  screen.findByText('Loading...')).not.toBeInTheDocument();
  ['Year', 'Title', 'Number of ratings', 'Average rating'].forEach((elem) => {
    expect( screen.getByRole('button', {name: elem})).toBeInTheDocument();
  })

});

test('filter movie list by genre (animation)', async () => {
  render(
    <Router>
      <HomePage />
    </Router>
  );
  
  await userEvent.click( await screen.findByRole('button', {name: 'Animation'}));
  expect(fetch).toHaveBeenCalledWith('/api/movies/?genre=Animation', {'method': 'GET'});
  expect(await screen.findByRole('heading', {name:'Citizen Kane'})).not.toBeInTheDocument();

})

test('filter movie list by country (USA)', async () => {
  render(
    <Router>
      <HomePage />
    </Router>
  );
  
  await userEvent.click( await screen.findByRole('button', {name: 'USA'}));
  expect(fetch).toHaveBeenCalledWith('/api/movies/?country=USA', {'method': 'GET'});
  expect(await screen.findByRole('heading', {name:'Princess Mononoke'})).not.toBeInTheDocument();

})

test('order movie list (by rating [asc])', async () => {
  render(
    <Router>
      <HomePage />
    </Router>
  );
  
  await userEvent.dblClick( await screen.findByRole('button', {name: /Average rating/i }));
  const moviesItems = await screen.findAllByRole('link')
  const moviesItemsText = screen.getAllByText(/Rating: [0-9]/)
  
  expect(fetch).toHaveBeenCalledWith('/api/movies/?ordering=avg_rating', {'method': 'GET'});
  expect(moviesItems).toHaveLength(2);
  expect(
    !!moviesItemsText.map(movie => parseFloat(/Rating: (\d*\.\d+|\d+),?/.exec(movie.textContent)[1])
    ).reduce((a,b) => a !== false && b >= a && b )
  ).toBeTruthy()
})