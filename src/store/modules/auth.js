import Moment from "moment";
//認証情報
const state = () => ({
  login: {
    token: false,
    name: "ゲスト",
    level: -1,
    created: null,
    update: null,
    expire: 0,
  },
});
const getters = {
  login: (state) => state.login,
  elapsed: (state) => {
    console.log(state.login);
    const dataFrom = Moment(state.login.update);
    const today = Moment();
    const elapsedDate = today.diff(dataFrom, "days");
    console.log("経過日数", elapsedDate);
    console.log(
      "更新日",
      dataFrom.format("YYYY/MM/DD"),
      "今日",
      today.format("YYYY/MM/DD")
    );

    if (elapsedDate > 90) alert("パスワードを更新してください");
    // else if (elapsedDate > 80)
    //   alert(`パスワードの更新期限まであと${90 - elapsedDate}日です`);
    return elapsedDate;
  },
};
const actions = {
  create: ({ commit }, login) => {
    commit("create", login);
  },
  destroy: ({ commit }) => {
    commit("destroy");
  },
};

const mutations = {
  create: (state, login) => {
    const data = login[0];
    const nowTime = new Date().getTime();
    //60分だけ認証
    const expireTime = 1000 * 60 * 60 + nowTime;
    state.login.token = true; // ログイントークン
    state.login.name = data.user_name; // ユーザー名
    state.login.level = parseInt(data.level); //レベル
    state.login.created = data.created_day;
    state.login.update = data.update;
    state.login.expire = Math.floor(expireTime); // APIからUNIXタイム(秒)で有効期限が返ってくるものとし、ミリ秒に変換しておく
  },
  destroy: (state) => {
    state.login.token = false;
    state.login.name = "";
    state.login.level = -1;
    state.login.expire = 0;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
