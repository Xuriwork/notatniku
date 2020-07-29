import axios from 'axios';
import store from '../store';

const token = store.getters.idToken;

export const api = axios.create({
	baseURL: `https://us-central1-notatniku.cloudfunctions.net/api`,
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

export default api;
