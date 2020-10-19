
// api/index.js

import axios from 'axios'

const API_URL = process.env.API_URL
// const API_URL = 'http://127.0.0.1:5000/api'

export function fetchCities (jwt) {
  return axios.get(`${API_URL}/cities/`, { headers: { Authorization: `Bearer: ${jwt}` } })
}

export function authenticate (userData) {
  return axios.post(`${API_URL}/login/`, userData)
}

export function save_current_city (city, jwt) {
  return axios.post(`${API_URL}/save_city/`, city, { headers: { Authorization: `Bearer: ${jwt}` } })
}

export function register (userData) {
  return axios.post(`${API_URL}/register/`, userData)
}
