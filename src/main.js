import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import VueFormulate from '@braid/vue-formulate';
import '@braid/vue-formulate/themes/snow/snow.scss';
import 'notyf/notyf.min.css';
import { auth } from './utils/firebase';

Vue.use(VueFormulate);

Vue.config.productionTip = false;

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  }
});