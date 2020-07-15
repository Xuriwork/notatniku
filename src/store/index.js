import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
import { auth, usersCollection } from '../utils/firebase';
import { Notyf } from 'notyf';
const notyf = new Notyf();

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		userProfile: {},
	},
	mutations: {
		setUserProfile(state, payload) {
			state.userProfile = payload;
		},
	},
	actions: {
		async signIn({ dispatch }, data) {
			console.log(data);
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
			dispatch('fetchUserProfile', user);
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
			dispatch('fetchUserProfile', user);
		},
		async handleForgotPassword(_, email) {
      await auth
      .sendPasswordResetEmail(email)
      .then(() => {
        notyf.success({
          message: 'Password reset email has been sent successful',
          duration: 9000,
          position: {
            x: 'left',
            y: 'top',
          },
        });
      })
      .catch((error) => (this.error = error.message));
		},
		async fetchUserProfile({ commit }, user) {
			const userDocument = await usersCollection.doc(user.uid).get();
			commit('setUserProfile', userDocument.data());
			router.push('/');
		},
	},
	modules: {},
});
