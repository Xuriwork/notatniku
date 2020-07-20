import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
import { auth, usersCollection } from '../utils/firebase';

import { Notyf } from 'notyf';

const notyf = new Notyf();

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		loading: false,
		user: {},
		userProfile: {},
		errors: {},
		notes: [],
		trash: [],
		selectedNote: {
			note: [],
			index: 0,
		},
		modalType: null,
	},
	mutations: {
		setLoading(state, payload) {
			state.loading = payload;
		},
		setUser(state, payload) {
			state.user = payload;
		},
		setUserProfile(state, payload) {
			state.userProfile = payload;
		},
		setNotes(state, payload) {
			state.notes = payload;
		},
		setTrash(state, payload) {
			state.trash = payload;
		},
		setSelectedNote(state, payload) {
			state.selectedNote = payload;
		},
		setErrors(state, payload) {
			state.errors = payload;
		},
		setModalType(state, payload) {
			state.modalType = payload;
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
			const { user } = await auth
				.createUserWithEmailAndPassword(data.email, data.password)
				.then((data) => {
					data.user.updateProfile({ displayName: data.name });
					usersCollection.doc(user.uid).set({
						name: data.name,
						dateCreated: new Date(),
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
		async handleSignOut({ commit }) {
			await auth
				.signOut()
				.then(() => router.push('/'))
				.catch((error) => commit('setErrors', error));
		},
		async handleForgotPassword(_, email) {
			await auth.sendPasswordResetEmail(email);
		},
		async fetchUser({ commit }, user) {
			commit('setLoading', true);

			const usersCollectionRef = usersCollection.doc(user.uid);
			await usersCollectionRef.onSnapshot((snapshot) => {
				commit('setUserProfile', snapshot.data());
			});
			commit('setUser', user);

			await usersCollectionRef.collection('notes').onSnapshot(
				(snapshot) => {
					const notes = [];
					snapshot.forEach((doc) => notes.push(doc.data()));
					const filteredNotes = notes.filter((note) => note.isTrash == false);
					commit('setNotes', filteredNotes);
					commit('setSelectedNote', {
						note: filteredNotes[0] ?? [],
						index: 0,
					});

					const trash = notes.filter((note) => note.isTrash == true);
					commit('setTrash', trash);
				},
				(error) => console.error(error)
			);

			commit('setLoading', false);

			if (
				router.currentRoute.path === '/sign-in' ||
				router.currentRoute.path === '/sign-up' ||
				router.currentRoute.path === '/forgot-password'
			) {
				router.push('/');
			}
		},
	},
	getters: {
		loading: (state) => state.loading,
		user: (state) => state.user,
		userId: (state) => state.user.uid,
		notes: (state) => state.notes,
		trash: (state) => state.trash,
		selectedNote: (state) => state.selectedNote,
		bookmarks: (state) => state.userProfile.bookmarks || [],
		modalType: (state) => state.modalType,
	},
	modules: {},
});
