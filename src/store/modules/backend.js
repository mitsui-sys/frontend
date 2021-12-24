const state = () => ({
  host:"harima-isk",
  port:"3000",
})

const getters = {
  host: state => state.host,
  port: state=> state.port,
}

const actions = {
    updateHost({ commit}, data){
      commit('updateHost', data)
    },
    updatePort({ commit}, data){
      commit('updatePort', data)
    },
}

const mutations = {
  updateHost(state, host){
    state.host = host
  },
  updatePort(state, port){
    state.port = port
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}