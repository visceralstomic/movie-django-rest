function refreshToken(){
    return fetch('/users/token/refresh/', {
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({refresh: localStorage.getItem('refresh_token') })
    }).then(res => {
      return res.json()
    })
  }
  
export default async function fetchWrapper(url, config){
      let access_token = localStorage.getItem('access_token');
      if (access_token){
         if (Date.now()/1000 >= JSON.parse(atob(access_token.split('.')[1])).exp){
            const data = await refreshToken();
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
         }
       }
      if (config.headers){
        if (config.headers.Authorization) config.headers.Authorization = "JWT " + localStorage.getItem('access_token');
      }
      return fetch(url, config); 
  }
  