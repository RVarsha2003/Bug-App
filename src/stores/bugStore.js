// stores/bugStore.js
import { defineStore } from 'pinia';

export const useBugStore = defineStore({
  id: 'bugStore',
  state: () => ({
    bugs: [
      {
        id: 1,
        title: 'apple',
        description: 'Description of Bug 1',
        priority: 'High',
        editing: false
      },
      {
        id: 2,
        title: 'Bug 2',
        description: 'Description of Bug 2',
        priority: 'Medium',
        editing: false
      }
    ]
  }),
  actions: {
    deleteBug(id) {
      this.bugs = this.bugs.filter(bug => bug.id !== id);
    },
    addBug(bug) {
      this.bugs.push({
        ...bug,
        id: this.bugs.length + 1,
        editing: false
      });
    },
    updateBug(updatedBug) {
      const index = this.bugs.findIndex(bug => bug.id === updatedBug.id);
      if (index !== -1) {
        this.bugs.splice(index, 1, updatedBug);
      }
    }
  }
});
