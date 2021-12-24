const state = () => ({ip: "harima-isk", port:50001,connected: false});

const getters = {
    ip: state => state.ip,
    port: state => state.port,
    connected: state => state.connected,
    url: state => `http://${state.ip}:${state.port}`
}

const actions = {
    updateIP({commit}, ip) {
        commit('updateIP', ip)
    },
    updatePort({commit}, port) {
        commit('updatePort', port)
    },
    updateConnected({commit}, connected) {
        commit('updatePort', connected)
    }
}

const mutations = {
    updateIP(state, ip) {
        state.ip = ip
    },
    updatePort(state, port){
        state.port = port
    },
    updateConnected(state, connected){
        state.connected = connected
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}