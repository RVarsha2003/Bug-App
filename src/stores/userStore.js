// store.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: {
      Tester: { name: 'Tester', password: 'E' },
      Admin: { name: 'Admin', password: 'W' },
      Developer: { name: 'Developer', password: '3' }
    }
  }),
  actions: {
    authenticate(name, password) {
      const user = this.users[name];
      return user && user.password === password ? name : null;
    }
  }
});
