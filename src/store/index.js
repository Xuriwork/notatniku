import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
import { auth, usersCollection } from '../utils/firebase';

import axios from 'axios';
import { Notyf } from 'notyf';

const notyf = new Notyf({
	duration: 9000,
	position: {
		x: 'right',
		y: 'top',
	},
});

Vue.use(Vuex);

if (process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = 'http://localhost:5001/notatniku/us-central1/api'
} else axios.defaults.baseURL = 'https://us-central1-notatniku.cloudfunctions.net/api';

export default new Vuex.Store({
	state: {
		loading: true,
		user: {},
		idToken: null,
		userProfile: {},
		errors: {},
		notes: [],
		trash: [],
		selectedNote: {},
		selectedNoteIndex: 0,
		modalType: null,
	},
	mutations: {
		setLoading(state, payload) {
			state.loading = payload;
		},
		setUser(state, payload) {
			state.user = payload;
		},
		setIdToken(state, payload) {
			state.idToken = payload;
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
		setSelectedNoteIndex(state, payload) {
			state.selectedNoteIndex = payload;
			state.selectedNote = state.notes[payload];
		},
		setErrors(state, payload) {
			state.errors = payload;
		},
		setModalType(state, payload) {
			state.modalType = payload;
		},
	},
	actions: {
		async signIn({ dispatch, commit }, data) {
			const { user } = await auth
				.signInWithEmailAndPassword(data.email, data.password)
				.catch((error) => notyf.error({ message: error.message }));
				
			dispatch('fetchUser', user).then(() => {
				router.push('/');
				commit('setLoading', false);
			});
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
				.catch((error) => notyf.error({ message: error.message }));
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
		async fetchUserTokenId({ commit }) {
			auth.currentUser.getIdToken(true).then((idToken) => {
				commit('setIdToken', idToken);
			});
		},
		async fetchUser({ commit }, user) {
			commit('setLoading', true);

			const usersCollectionRef = usersCollection.doc(user.uid);
			await usersCollectionRef.onSnapshot((snapshot) => {
				commit('setUserProfile', snapshot.data());
			});
			commit('setUser', user);

			await usersCollectionRef
				.collection('notes')
				.orderBy('dateModified', 'desc')
				.onSnapshot(
					(snapshot) => {
						const notes = [];
						snapshot.forEach((doc) => notes.push(doc.data()));
						const filteredNotes = notes.filter((note) => note.isTrash == false);
						commit('setNotes', filteredNotes);

						const trash = notes.filter((note) => note.isTrash == true);
						commit('setTrash', trash);
					},
					(error) => console.error(error)
				);
		},
	},
	getters: {
		loading: (state) => state.loading,
		user: (state) => state.user,
		userId: (state) => state.user.uid,
		idToken: (state) => state.idToken,
		notes: (state) => state.notes,
		trash: (state) => state.trash,
		selectedNote: (state) => state.notes[state.selectedNoteIndex] || {},
		selectedNoteIndex: (state) => state.selectedNoteIndex,
		bookmarks: (state) => state.userProfile.bookmarks || [],
		isBookmarked: (state) => {
			const bookmarks = state.userProfile.bookmarks;
			const arrayOfBookmarkIds = bookmarks.map((bookmark) => bookmark);
			return arrayOfBookmarkIds.includes(state.selectedNote.id);
		},
		modalType: (state) => state.modalType,
	},
	modules: {},
});
