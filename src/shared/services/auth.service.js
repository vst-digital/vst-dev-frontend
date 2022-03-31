const signIn = (email, password) => ({
    baseURL: process.env.REACT_APP_AUTH_API_BASE_URL,
    url: '/users/sign_in', method: 'post',
    Headers: {"Content-Type": 'application/json'},
    data: {user: {email, password}}
});

const refreshAuthorization = (refresh_token) => ({
    baseURL: process.env.REACT_APP_AUTH_API_BASE_URL,
    url: '/token', method: 'post', params: {grant_type: 'refresh_token'},
    data: {refresh_token, client_id: process.env.REACT_APP_CLIENT_ID}
});

export {signIn, refreshAuthorization};