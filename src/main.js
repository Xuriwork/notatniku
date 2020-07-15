import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import 'notyf/notyf.min.css';
import { auth } from './utils/firebase';

Vue.config.productionTip = false;

let app;
auth.onAuthStateChanged((user) => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  }

  console.log(user)

  if (user) store.dispatch('fetchUser', user);
});