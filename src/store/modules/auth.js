const state = () => ({
    login: {
      token: false,
      name: "ゲスト",
      level: -1,
      expire: 0
    }
})
const getters = {
    login: state => state.login,
}
const actions = {
    create :({commit}, login) => {
      commit("create",login)
    },
    destroy :({commit}) => {
      commit("destroy")
    },
}

const mutations = {
    create: (state, login) =>{
      const data = login[0]
      const nowTime = (new Date()).getTime()
      //30分だけ認証
      const expireTime = 1000 * 60 * 30 + nowTime
      state.login.token  = true                     // ログイントークン
      state.login.name = data.user_name                      // ユーザー名
      state.login.level = data.level //レベル
      state.login.expire = Math.floor(expireTime) // APIからUNIXタイム(秒)で有効期限が返ってくるものとし、ミリ秒に変換しておく
    },
    destroy: (state) =>{
      state.login.token  = false
      state.login.name   = ""
      state.login.level = -1
      state.login.expire = 0
    }
}
 
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}