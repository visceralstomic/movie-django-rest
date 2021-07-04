const movieList = [
    {
      id: 2,
      title: "Princess Mononoke",
      year: "1997-08-12",
      director: [
        {
          id: 2,
          name: "Hayao",
          surname: "Miyazaki"
        }
      ],
      writers: [
        {
          id: 2,
          name: "Hayao",
          surname: "Miyazaki"
        }
      ],
      actors: [
        {
          id: 3,
          name: "Yōji",
          surname: "Matsuda"
        }
      ],
      plot: "In Muromachi Japan, an Emishi village is attacked by a demon.",
      genres: [
        {
          id: 2,
          name: "Animation"
        }
      ],
      countries: [
        {
          id: 3,
          name: "Japan"
        }
      ],
      num_of_ratings: 3,
      avg_rating: 8.666666666666666,
      reviews: [
        {
          id: 6,
          title: "Great",
          review_text: "One of the best animated movies",
          author: {
            id: 2,
            username: "John"
          },
          approved: true,
          movie: {
            id: 2,
            title: "Princess Mononoke",
            year: "1997-08-12"
          }
        },
        {
          id: 8,
          title: "Excelent",
          review_text: "Best anime ever",
          author: {
            id: 3,
            username: "paul"
          },
          approved: true,
          movie: {
            id: 2,
            title: "Princess Mononoke",
            year: "1997-08-12"
          }
        }
      ]
    },
    {
      id: 1,
      title: "Citizen Kane",
      year: "1941-09-05",
      director: [
        {
          id: 1,
          name: "Orson",
          surname: "Welles"
        }
      ],
      writers: [
        {
          id: 1,
          name: "Orson",
          surname: "Welles"
        }
      ],
      actors: [
        {
          id: 1,
          name: "Orson",
          surname: "Welles"
        }
      ],
      plot: "Rosebud",
      genres: [
        {
          id: 1,
          name: "Drama"
        }
      ],
      countries: [
        {
          id: 1,
          name: "USA"
        }
      ],
      num_of_ratings: 2,
      avg_rating: 8.0,
      reviews: [
        {
          id: 10,
          title: "Great",
          review_text: "Welles is a master",
          author: {
            id: 3,
            username: "paul"
          },
          approved: true,
          movie: {
            id: 1,
            title: "Citizen Kane",
            year: "1941-09-05"
          }
        }
      ]
    },
  ]

const genres = [
    {
        "id": 2,
        name: "Animation"
    },
    {
        "id": 1,
        name: "Drama"
    }
]

const countries = [
    {
        "id": 1,
        name: "USA"
    },
    {
        "id": 3,
        name: "Japan"
    }
]


const userMovieRating = [
  {
    rating: 9
  },
]


const review = {
  "id": 6,
  "title": "Great",
  "review_text": "One of the best animated movies",
  "created": "2021-03-06T15:50:39.219666Z",
  "approved": true,
  "author": {
    "id": 2,
    "username": "John"
  },
  "movie": {
    "id": 2,
    "title": "Princess Mononoke",
    "year": "1997-08-12"
  }
}

const staff = {
  "id": 1,
  "name": "Orson",
  "surname": "Welles",
  "director": [
    {
      "id": 1,
      "title": "Citizen Kane",
      "year": "1941-09-05"
    },
    {
      "id": 4,
      "title": "Touch of Evil",
      "year": "1958-05-09"
    }
  ],
  "writers": [
    {
      "id": 1,
      "title": "Citizen Kane",
      "year": "1941-09-05"
    },
    {
      "id": 4,
      "title": "Touch of Evil",
      "year": "1958-05-09"
    }
  ],
  "actors": [
    {
      "id": 1,
      "title": "Citizen Kane",
      "year": "1941-09-05"
    },
    {
      "id": 4,
      "title": "Touch of Evil",
      "year": "1958-05-09"
    }
  ]
}

const blankStaff = {
  "id": 2,
  "name": "Buster",
  "surname": "Keaton",
  "director": [
  ],
  "writers": [
  ],
  "actors": [
  ]
}

export {movieList, genres, countries, userMovieRating, review, staff, blankStaff} ;