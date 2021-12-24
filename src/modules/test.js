// hogeのモジュール
const moduleA = {
  namespaced: true,
  state: {
    hoge: 100
  },
  getters: {
    getVal: state => state.hoge
  },
  mutations: {
    hoge_mutations: () => {
      // 省略 ...
    }
  },
  actions: {
    hoge_actions: () => {
      // 省略 ...
    }
  }
};

// fugaのモジュール
const moduleB = {
  namespaced: true,
  state: {
    fuga: 250
  },
  getters: {
    getVal: state => state.fuga
  }
};

export default new Vuex.Store({
  modules: {
    modA: moduleA,
    modB: moduleB
  }
)};