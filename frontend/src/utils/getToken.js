import * as jwtDecode from 'jwt-decode';

function getToken(raw=false) {
  let token = sessionStorage.getItem('token');
  if (token) {
    if (raw) return token;
    return jwtDecode(token);
  } else {
    return undefined;
  }
}

export default getToken;
