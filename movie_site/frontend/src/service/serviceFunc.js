
class ServiceFunc {
  constructor() {
    this.urlBase = '/api'
  }

  async getRecource(url=''){
    const curUrl = this.urlBase + url;
    const res = await fetch(curUrl)

    if (!res.ok){
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    return await res.json();
  }

  getMovieList(){
    return this.getRecource("/movies/");
  }

  getMovie(movieId){
    return this.getRecource(`/movies/${movieId}`);
  }

  getStaffPerson(staffId){
    return this.getRecource(`/staff/${staffId}`);
  }

  getReview(reviewId){
    return this.getRecource(`/movies/reviews/${reviewId}`);
  }
}

class AuthFunc {
  constructor(){
    this.urlBase = "/users/token"
  }

  async getRecource(url, username, password){
    const curUrl = this.urlBase + url;
    const res = await fetch(curUrl, {
      method: "POST",
      headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({username,password})
    })
    if (!res.ok){
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    return await res.json();
  }

  loginUser(username, password){
    let data = this.getRecource('/obtain/',  username, password);
    return data;
  }
}



export {ServiceFunc, AuthFunc};
