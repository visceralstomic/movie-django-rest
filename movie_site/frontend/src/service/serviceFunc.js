import fetchWrapper from "./fetchWrapper";


class ServiceFunc {
  constructor() {
    this.urlBase = '/api';
    this.headers = {
      'Authorization': "JWT " + localStorage.getItem('access_token')
    };
  }

  async getResource(url='', auth=true){
    const curUrl = this.urlBase + url;
    const method = {method:"GET"};
    const params = auth ? {...method, headers: {...this.headers}}: method ;
    const res = await fetchWrapper(curUrl, params);
    if (!res.ok){
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    return await res.json();
  }

  getMovieList(params=""){
    return this.getResource("/movies/" + params, false);
  }

  getMovie(movieId){
    return this.getResource(`/movies/${movieId}`, false);
  }

  getStaffPerson(staffId){
    return this.getResource(`/staff/${staffId}`, false);
  }

  getReview(reviewId){
    return this.getResource(`/movies/reviews/${reviewId}`, false);
  }

  getAllStaff(){
    return this.getResource("/admin/staff/")
  }

  getUserMovieRating(movieId) {
    return this.getResource(`/user_movie_rating/${movieId}`)
  }

  getCountries(watchOnly=true){
    return this.getResource("/admin/countries/", watchOnly)
  }

  getGenres(watchOnly=true){
    return this.getResource("/admin/genres/", watchOnly)
  }


  async handlingRecource(url, body, HTTP_Method='POST', auth=true){
    const curUrl = this.urlBase + url;
    const method = { method: HTTP_Method};
    const content = {'Content-Type': 'application/json'};
    const params = auth ? { ...method, headers: {...content, ...this.headers }}
                        : {...method, headers: {...content}};
    const res = await fetchWrapper(curUrl, {
      ...params,
      body: JSON.stringify(body)
    })

    if (res.status > 400){
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    return await res.json();
  }

  rateMovie(movieId, mark){
    return this.handlingRecource(`/movies/${movieId}/rate/`,{"mark": mark})
  }

  createReview(body){
    return this.handlingRecource("/movies/reviews/", body)
  }

  editReview(reviewId, body){
    return this.handlingRecource(`/movies/reviews/${reviewId}`, body, 'PATCH')
  }

  addMovie(body) {
    return this.handlingRecource('/movies/', body);
  }

  search(body){
    return this.handlingRecource('/search/', body, 'POST', false);
  }

  approveReview(reviewId){
    return this.handlingRecource(`/admin/reviews/${reviewId}/approve`, {}, 'PATCH');
  }

  addStaff(body){
    return this.handlingRecource('/admin/staff/', body);
  }

  addGenre(body){
    return this.handlingRecource('/admin/genres/', body);
  }

  addCountry(body){
    return this.handlingRecource('/admin/countries/', body);
  }



  async deleteReq(url){
    const curUrl = this.urlBase + url;
    const res = await fetch(curUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token')
      }
    })

    if (res.status >= 400){
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    return await res;
  }

  deleteReview(reviewId){
    return this.deleteReq(`/movies/reviews/${reviewId}`)
  }

  adminRemoveReview(reviewId){
    return this.deleteReq(`/admin/reviews/${reviewId}/remove`);
  }

}



class UserFunc {
  constructor(){
    this.urlBase = "/users";
  }

  async getResource(url=''){
    const curUrl = this.urlBase + url;
    const res = await fetchWrapper(curUrl, {
      method:'GET',
      headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token')
      }
    })
    if (!res.ok){
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    return await res.json();
  }

  getUserPage(uid){
    return this.getResource(`/${uid}`);
  }

  getRatingStats(){
    return this.getResource("/rating_stats/");
  }

  getUserStats(){
    return this.getResource("/user_stats/");
  }

  getCurrentUser(){
    return this.getResource('/current_user/')
  }



  async handlingResource(url='', body, adtnlHeaders, HTTP_Method="POST"){
    
    const curUrl = this.urlBase + url;
    const res = await fetch(curUrl, {
          method: HTTP_Method,
          headers: {
            'accept': 'application/json', ...adtnlHeaders
          },
          body: body
        })

    if (res.status === 401){
      throw new Error(res.statusText)
    } else if (res.status > 401) {
      throw new Error(`Couldn't fetch ${curUrl}. ${res.status}`)
    }
    try {
      return await res.json()
    } catch {
      return await res;
    }
  }

  loginUser(username, password){
    return this.handlingResource(
      '/token/obtain/',  
      JSON.stringify({username:username, password:password}),
      {'Content-Type': 'application/json'});
  }

  logoutAndBlacklist(){
    return this.handlingResource('/blacklist/',   
      JSON.stringify({ refresh_token: localStorage.getItem("refresh_token") }),  
      {'Content-Type': 'application/json'} );
  }

  registerUser(body){
    return this.handlingResource('/register/',
      JSON.stringify(body),
      {'Content-Type': 'application/json'} );
  }

  updateUser(uid, body){
    return this.handlingResource(`/${uid}`, body, {},'PATCH')
  }


}



export {ServiceFunc, UserFunc};
