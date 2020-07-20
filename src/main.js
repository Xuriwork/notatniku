import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { auth } from './utils/firebase';

import { firestorePlugin } from 'vuefire';
import Fragment from 'vue-fragment';

import 'notyf/notyf.min.css';

Vue.use(firestorePlugin, { wait: true });
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