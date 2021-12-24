const state = () => ({
  tableName:"tbl_shokai",
  conditions:[],
})

const getters = {
  tableName: state => state.tableName,
  header: state => state.header,
  headerA: state => {
    let headerA = state.header.slice(0, state.header.length)
    headerA.push(state.actionitem)
    return headerA
  },
  conditions: state => state.conditions,
  params(state){
    let queryStr = `tblName=${state.name}`
    let conds = state.conditions
    //const isNumberString = n => typeof n === "string" && n !== "" &&  !isNaN( n );
 
    for(let key in conds){
      queryStr += "&"
      // queryStr += `${key}="${conds[key].text},${conds[key].rule},${conds[key].value}"`
      console.log(key)
      queryStr += `${conds[key].text}=${conds[key].value}`
    }
    console.log(queryStr)  
    return queryStr
  }
}

const actions = {
    updateTableName({ commit}, name){
      commit('updateTableName', name)
    },
    updateCond({commit}, cond){
      commit('updateCond', cond)
    }
}

const mutations = {
  updateName(state, name){
    state.tableName = name
  },
  updateCond (state, cond) {
    state.conditions = cond
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}