
class ServiceFunc {
  constructor() {
    this.urlBase = '/api'
  }

  async getRecource(url=''){
    const curUrl = this.urlBase + url;
    const res = await fetch(curUrl, {
      method:'GET',
      headers:{
        'Authorization': "JWT " + localStorage.getItem('access_token'),
      }

    })

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

  getAllStaff(){
    return this.getRecource("/admin/staff/")
  }

  getCountries(){
    return this.getRecource("/admin/countries/")
  }

  getGenres(){
    return this.getRecource("/admin/genres/")
  }

  async postReq(url, body, HTTP_Method='POST'){
    const res = await fetch(this.urlBase + url, {
      method: HTTP_Method,
      headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (res.status > 400){
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    return await res.json();
  }

  rateMovie(movieId, mark){
    return this.postReq(`/movies/${movieId}/rate/`,{"mark": mark})
  }

  createReview(body){
    return this.postReq("/movies/reviews/", body)
  }

  editReview(reviewId, body){
    return this.postReq(`/movies/reviews/${reviewId}`, body, 'PATCH')
  }

  addMovie(body) {
    return this.postReq('/movies/', body);
  }

}

class AuthFunc {
  constructor(){
    this.urlBase = "/users";
  }

  async handlingRecource(url, body){
    const curUrl = this.urlBase + url;
    const res = await fetch(curUrl, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify(body)
        })

    if (res.status > 400){
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    try {
      return await res.json()
    } catch {
      return await res;
    }
  }

  loginUser(username, password){
    return this.handlingRecource('/token/obtain/',  {username:username, password:password});
  }

  logoutAndBlacklist(){
    return this.handlingRecource('/blacklist/', {  refresh_token: localStorage.getItem("refresh_token") });
  }

  async getCurrentUser(){
    const res = await fetch("/users/current_user/", {
      headers:{
          'access': localStorage.getItem('access_token'),
        }
    })
    if (res.status > 400){
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    return await res.json()
  }
}



export {ServiceFunc, AuthFunc};
