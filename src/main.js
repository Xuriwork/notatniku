import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { auth } from './utils/firebase';

import Fragment from 'vue-fragment';
import VueSanitize from 'vue-sanitize';
import Vue2TouchEvents from 'vue2-touch-events';

import 'notyf/notyf.min.css';

Vue.use(Fragment.Plugin);
Vue.use(VueSanitize);
Vue.use(Vue2TouchEvents);

Vue.config.productionTip = false;

let app;
auth.onAuthStateChanged((user) => {
	store.commit('setLoading', true);

	if (user) {
		store.dispatch('fetchUser', user).then(() => store.dispatch('fetchUserTokenId'));
	}

	if (!app) {
		new Vue({
			router,
			store,
			render: (h) => h(App),
		}).$mount('#app');
	}

	store.commit('setLoading', false);
});
