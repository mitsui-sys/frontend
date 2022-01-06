//現在の表示情報について
const state = () => ({
  kind: "home",
  data: [],
  count: 0,
  step: 1,
  content: [],
});

const getters = {
  kind: (state) => state.kind,
  data: (state) => state.data,
  count: (state) => state.count,
  step: (state) => state.step,
  content: (state) => state.content,
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
