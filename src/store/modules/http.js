import axios from "axios";

const state = { todos: [] };

const getters = {
  allTodos: (state) => state.todos,
};

const actions = {
  // Set todo
  async fetchTodos({ commit }, url) {
    const response = await axios.get(url);
    commit("setTodos", response.data);
  },
  // Add todo
  async addTodo({ commit }, url, data) {
    const response = await axios.post(url, data);
    commit("newTodo", response.data);
  },
  // delete todo
  async deleteTodo({ commit }, url, id) {
    await axios.delete(`${url}/${id}`);
    commit("removeTodo", id);
  },
  // update todo
  async updateTodo({ commit }, url, id, data) {
    const response = await axios.put(`${url}/${id}`, data);
    commit("updateTodo", response.data);
  },
};

const mutations = {
  // settodo
  setTodos: (state, todos) => (state.todos = todos),
  // Addtodo
  newTodo: (state, todo) => state.todos.unshift(todo),
  // deletetodo
  removeTodo: (state, id) =>
    (state.todos = state.todos.filter((todo) => todo.id !== id)),
  // updatetodo
  updateTodo: (state, updTodo) => {
    const index = state.todos.findIndex((todo) => todo.id === updTodo.id);
    if (index !== -1) {
      state.todos.splice(index, 1, updTodo);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
