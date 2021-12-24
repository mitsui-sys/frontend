const state = () => ({modules: []})

const getters = {
    count(state, getters, rootState) {
    //     return rootState.counter.count + rootState.doubleCounter.count
    // }
        let sum = 0
        state.modules.forEach((elem) => {
            console.log(elem, rootState[elem],rootState[elem].count)
            sum += rootState[elem].count
        })
        return sum
    }
}

const actions = {
    setModules({commit}, val) {
        commit('setModules', val)
    }
}

const mutations = {
    setModules(state, val) {
        state.modules = val
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}