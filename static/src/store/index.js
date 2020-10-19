// store/index.js

import Vue from 'vue'
import Vuex from 'vuex'

// imports of AJAX functions will go here
import {
  fetchCities,
  authenticate,
  register,
  save_current_city
} from '@/api'
import { isValidJwt, EventBus } from '@/utils'

Vue.use(Vuex)

const state = {
  // single source of data
  user: {},
  cities: {},
  jwt: ''
}

const actions = {
  loadCities (context) {
    return fetchCities(context.state.jwt.token)
      .then((response) => {
            context.commit('setCities', { cities: response.data })
      })
  },
  login (context, userData) {
    context.commit('setUserData', { userData })
    return authenticate(userData)
      .then(response => context.commit('setJwtToken', { jwt: response.data }))
      .catch(error => {
        console.log('Error Authenticating: ', error)
        EventBus.emit('failedAuthentication', error)
      })
  },
  register (context, userData) {
    context.commit('setUserData', { userData })
    return register(userData)
      .then(context.dispatch('login', userData))
      .catch(error => {
        console.log('Error Registering: ', error)
        EventBus.emit('failedRegistering: ', error)
      })
  },
  save_city (context, current_city) {
    return save_current_city(current_city, context.state.jwt.token)
  },
}

const mutations = {
  setCities (state, payload) {
    state.cities = payload.cities
  },
  setUserData (state, payload) {
    console.log('setUserData payload = ', payload)
    state.userData = payload.userData
  },
  setJwtToken (state, payload) {
    console.log('setJwtToken payload = ', payload)
    localStorage.token = payload.jwt.token
    state.jwt = payload.jwt
  },
}

const getters = {
  // reusable data accessors
  isAuthenticated (state) {
    return isValidJwt(state.jwt.token)
  },
   get_current_city (state) {
    return state.cities.user_city
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})

export default store
