import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
import { auth, usersCollection } from '../utils/firebase';
import { Notyf } from 'notyf';
const notyf = new Notyf();

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: {},
		errors: {},
	},
	mutations: {
		setUser(state, payload) {
			state.user = payload;
		},
		setErrors(state, payload) {
			state.errors = payload;
		},
	},
	actions: {
		async signIn({ dispatch }, data) {
			const { user } = await auth
				.signInWithEmailAndPassword(data.email, data.password)
				.catch((error) => {
					notyf.error({
						message: error.message,
						duration: 9000,
						position: {
							x: 'left',
							y: 'top',
						},
					});
				});
			dispatch('fetchUser', user);
		},
		async signUp({ dispatch }, data) {
			const dateCreated = new Date();
			const { user } = await auth
				.createUserWithEmailAndPassword(data.email, data.password)
				.then((data) => {
					data.user.updateProfile({ displayName: data.name });
					usersCollection.doc(user.uid).set({
						name: data.name,
						dateCreated,
					});
				})
				.catch((error) => {
					notyf.error({
						message: error.message,
						duration: 9000,
						position: {
							x: 'left',
							y: 'top',
						},
					});
				});
			dispatch('fetchUser', user);
		},
		async handleForgotPassword(_, email) {
			await auth.sendPasswordResetEmail(email).then(() => {
				notyf.success({
					message: 'Password reset email has been sent successful',
					duration: 9000,
					position: {
						x: 'left',
						y: 'top',
					},
				});
			});
		},
		async fetchUser({ commit }, user) {
			const userDocument = await usersCollection.doc(user.uid).get();
			commit('setUser', userDocument.data());
			if (
				router.currentRoute.path === '/sign-in' ||
				router.currentRoute.path === '/sign-up'
			) {
				router.push('/');
			}
		},
	},
	modules: {},
});
