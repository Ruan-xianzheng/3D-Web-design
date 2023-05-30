import Vue from 'vue'
import App from './App.vue'
// import store from './store'
// import App from './industry.vue'

Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
//   store,
// }).$mount('#app')
new Vue({
  el: '#app',
  // store,
  render: h => h(App),
  
})
