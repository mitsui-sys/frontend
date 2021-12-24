const state = {
  isShow: false
}

const getters = {
  isShow: state => state.isShow,
}

const actions = {
  updateIsShow({ commit}, isShow){
    commit('updateIsShow', isShow)
  },
}

const mutations = {
  updateIsShow(state, isShow){
    state.isShow = isShow
  },
  show (state) {
    state.isShow = true
  },
  hide (state) {
    state.isShow = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}