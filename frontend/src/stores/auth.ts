import { defineStore } from 'pinia';
import api from '../utils/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: localStorage.getItem('username') || null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(username: string, password: string): Promise<boolean> {
            try {
                const response = await api.post('/auth/login', { username, password });
                this.token = response.data.token;
                this.user = response.data.username;
                localStorage.setItem('token', this.token!);
                localStorage.setItem('username', this.user!);
                return true;
            } catch (error) {
                return false;
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        }
    }
});
