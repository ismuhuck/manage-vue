import { getToken, setToken } from '@/utils/auth'
import { loginApi } from '@/services/api/login'

const state = () => ({
  token: getToken(),
  name: '',
})

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
}

const actions = {
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginApi
        .login(userInfo)
        .then((res) => {
          console.log('res', res)
          const { data } = res
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch((error) => {
          console.log('error', error)
          reject(error)
        })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
