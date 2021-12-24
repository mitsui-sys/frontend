//グローバル変数の定義

import Vue from 'vue'
import Vuex from 'vuex'
import counter from './store/modules/counter'
import doubleCounter from './store/modules/doubleCounter'
import totalCounter from './store/modules/totalCounter'
import table from './store/modules/table'
import ipconfig from './store/modules/ipconfig'
import auth from './store/modules/auth'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)


const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    counterA: counter,
    counterB: counter,
    doubleCounterA: doubleCounter,
    doubleCounterB: doubleCounter,
    totalCounter,
    table: table,
    backend: ipconfig,
    db: ipconfig,
    auth: auth
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  plugins: [
    createPersistedState({
      key: "xxxproject",     // プロジェクト単位の一意の識別子
      paths: ["auth.login"], // auth.js の loginキーは再度アクセスしても保持するようにする
      storage: localStorage  // 今回は localStorage に保存することにする
    })
  ]
})
store.dispatch('totalCounter/setModules',['counterA','counterB', 'doubleCounterA', 'doubleCounterB'])

export default store