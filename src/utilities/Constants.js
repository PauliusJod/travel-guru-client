const API_BASE_URL_DEVELOPMENT = "https://localhost:7233"; //https.. http.

const ENDPOINTS = {
  TO_HOME: "api/#",
  TO_LOGIN: "api/login",
  TO_REGISTER: "api/register",
  TO_SAVE_ROUTE: "api/saveroute",
  TO_UPDATE_PASSWORD: "api/updatepassword",
  TO_UPDATE_EMAIL: "api/updateemail",
};
const development = {
  API_URL_LOGIN: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.TO_LOGIN}`,
  API_URL_REGISTER: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.TO_REGISTER}`,
  API_URL_SAVE_ROUTE: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.TO_SAVE_ROUTE}`,
  API_URL_UPDATE_PASSWORD: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.TO_UPDATE_PASSWORD}`,
  API_URL_UPDATE_EMAIL: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.TO_UPDATE_EMAIL}`,
};
const Constants = development;

export default Constants;
