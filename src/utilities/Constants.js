const API_BASE_URL_DEVELOPMENT = "http://localhost:5097"; //https.. http.

const ENDPOINTS = {
    TO_HOME: 'api/#',
    TO_LOGIN: 'api/login',
    TO_REGISTER: 'api/register'
}
const development = {
    API_URL_LOGIN: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.TO_LOGIN}`,
    API_URL_REGISTER: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.TO_REGISTER}`
};

const Constants = development;

export default Constants;