const state = () => ({
  host: "harima-isk",
  port: "5432",
  user: "postgres",
  password: "postgres",
  tableName: "kc28382_bunkazai",
  tableNameList: [],
  header: [],
  content: [],
  selected: [],
  p_header: [
    {
      text: "プロパティ",
      value: "name",
    },
    {
      text: "値",
      value: "value",
    },
  ],
  conditions: [],
  actionitem: { text: "Actions", value: "actions", sortable: false },
  replace: [],
});

const getters = {
  host: (state) => state.host,
  port: (state) => state.port,
  user: (state) => state.user,
  password: (state) => state.password,
  tableName: (state) => state.tableName,
  tableNameList: (state) => state.tableNameList,
  header: (state) => state.header,
  content: (state) => state.content,
  selected: (state) => state.selected,
  p_header: (state) => state.p_header,
  conditions: (state) => state.conditions,
  replace: (state) => state.replace,
  params: (state) => {
    let queryStr = `tblName=${state.tableName}`;
    let conds = state.conditions;
    //const isNumberString = n => typeof n === "string" && n !== "" &&  !isNaN( n );

    for (let key in conds) {
      queryStr += `& ${conds[key].text}=${conds[key].value}`;
    }
    return queryStr;
  },
  shownHeaders: (state) => {
    return state.header.filter((h) => h.shown);
  },
};

const actions = {
  updateHost({ commit }, data) {
    commit("updateHost", data);
  },
  updatePort({ commit }, data) {
    commit("updatePort", data);
  },
  updateUser({ commit }, data) {
    commit("updateUser", data);
  },
  updatePassword({ commit }, data) {
    commit("updatePassword", data);
  },
  updateTableName({ commit }, data) {
    commit("updateTableName", data);
  },
  updateTableNameList({ commit }, tableNameList) {
    // システムテーブルは除く
    let datas = [];
    for (let i in tableNameList) {
      let tableName = tableNameList[i]["tablename"];
      if (tableName != "spatial_ref_sys" && !tableName.includes("注記")) {
        datas.push(tableNameList[i].tablename);
      }
    }
    commit("updateTableNameList", datas);
  },
  updateHeader({ commit }, header) {
    commit("updateHeader", header);
  },
  updateContent({ commit }, content) {
    commit("updateHeader", content);
  },
  updateData({ commit }, data) {
    let header = [];
    if (data.length > 0) {
      let first = Object.keys(data[0]);
      let width = 100.0 / first.length;
      let size_text = `${parseInt(width)}%`;

      first.forEach((key) => {
        const isShow = !(key == "gid" || key == "geometry");
        let obj = {
          text: key,
          value: key,
          width: size_text,
          align: "left",
          shown: isShow,
        };
        header.push(obj);
      });
    }
    commit("updateHeader", header);
    commit("updateContent", data);
  },
  updateSelected({ commit }, selected) {
    commit("updateSelected", selected);
  },
  updateCond({ commit }, cond) {
    commit("updateCond", cond.slice());
  },
  updateReplace({ commit }, replace) {
    commit("updateReplace", replace);
  },
};

const mutations = {
  updateHost(state, host) {
    state.host = host;
  },
  updatePort(state, port) {
    state.port = port;
  },
  updateUser(state, user) {
    state.user = user;
  },
  updatePassword(state, password) {
    state.password = password;
  },
  updateTableName(state, tableName) {
    state.tableName = tableName;
  },
  updateTableNameList(state, tableNameList) {
    state.tableNameList = tableNameList;
  },
  updateHeader(state, header) {
    state.header = header;
  },
  updateContent(state, content) {
    state.content = content;
  },
  updateSelected(state, data) {
    let selected = [];
    for (let key in data) {
      selected.push({ name: key, value: data[key] });
    }
    state.selected = selected;
  },
  updateCond(state, cond) {
    state.conditions = cond;
  },
  updateReplace(state, replace) {
    state.replace = replace;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
