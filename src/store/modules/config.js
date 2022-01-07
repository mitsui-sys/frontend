//現在の表示情報について
const state = () => ({
  kind: "home",
  data: [],
  count: 0,
  step: 1,
  content: [],
  development: false,
});

const getters = {
  kind: (state) => state.kind,
  data: (state) => state.data,
  count: (state) => state.count,
  step: (state) => state.step,
  content: (state) => state.content,
  development: (state) => state.development,
};

const actions = {
  updateKind({ commit }, value) {
    commit("updateKind", value);
  },
  updateContent({ commit }, value) {
    commit("updateContent", value);
  },
  increment({ commit }) {
    commit("increment");
  },
  decrement({ commit }) {
    commit("decrement");
  },
  updateDevelopment({ commit }, development) {
    commit("updateDevelopment", development);
  },
};

const mutations = {
  updateKind(state, kind) {
    state.kind = kind;
  },
  updateContent(state, content) {
    state.content = content;
  },
  increment(state) {
    state.count += state.step;
  },
  decrement(state) {
    state.count -= state.step;
  },
  updateDevelopment(state, development) {
    state.development = development;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
