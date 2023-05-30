import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  // 定义状态
  state: {
    model: null,
  },
  // 定义修改状态的方法，即mutation
  mutations: {
    setModel(state, model) {
      state.model = model;
    },
  },
  // 定义获取状态的方法，即getter
//   getters: {
//     getCount(state) {
//       return state.count
//     }
//   }
})
export default store