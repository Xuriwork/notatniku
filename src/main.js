import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { auth } from './utils/firebase';

import Fragment from 'vue-fragment';
import VueSanitize from 'vue-sanitize';

import 'notyf/notyf.min.css';

Vue.use(Fragment.Plugin);
Vue.use(VueSanitize);

Vue.config.productionTip = false;

let app;
auth.onAuthStateChanged((user) => {
	store.commit('setLoading', true);

	if (!app) {
		new Vue({
			router,
			store,
			render: (h) => h(App),
		}).$mount('#app');
	}

	store.commit('setLoading', false);

	if (user) {
		store
			.dispatch('fetchUser', user)
			.then(() => store.dispatch('fetchUserTokenId'))
			.then(() => store.commit('setLoading', false));
	}
});
