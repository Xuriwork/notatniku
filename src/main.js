import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { auth } from './utils/firebase';

import Fragment from 'vue-fragment';
import axios from 'axios';

import 'notyf/notyf.min.css';

axios.defaults.baseURL = 'https://us-central1-notatniku.cloudfunctions.net/api';

Vue.use(Fragment.Plugin);

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

  if (user) store.dispatch('fetchUser', user);
});