import { defineStore } from 'pinia';

export const useDeveloperStore = defineStore({
  id: 'developerStore',
  state: () => ({
    developers: [
      {
        name: 'Nimisha',
        tasks: [
          { id: 1, Title: 'calci',Description: 'calci',Priority: 'calci', status: 'completed', startDate: '2024-07-20', endDate: '2024-07-27' },
          { id: 2, task: 'Task 2', status: 'incomplete', startDate: '2024-07-21', endDate: '2024-07-28' }
        ]
      },
      {
        name: 'Manju',
        tasks: [
          { id: 1, task: 'earphone', status: 'completed', startDate: '2024-07-19', endDate: '2024-07-26' },
          { id: 2, task: 'Task 3', status: 'incomplete', startDate: '2024-07-22', endDate: '2024-07-29' }
        ]
      }
    ],
    currentDeveloper: null,
    completedTasks: [],
    incompleteTasks: []
  }),
  actions: {
    assignTask(devname, task, startDate, endDate) {
      const developer = this.developers.find(dev => dev.name.toLowerCase() === devname.toLowerCase());
      if (developer) {
        developer.tasks.push({
          id: developer.tasks.length + 1,
          task,
          status: 'incomplete', // Default status
          startDate,
          endDate
        });
        this.categorizeTasks();
      } else {
        this.developers.push({
          name: devname,
          tasks: [
            {
              id: 1,
              task,
              status: 'incomplete', // Default status
              startDate,
              endDate
            }
          ]
        });
        this.categorizeTasks();
      }
    },
    loginDeveloper(devname) {
      const developer = this.developers.find(dev => dev.name.toLowerCase() === devname.toLowerCase());
      if (developer) {
        this.currentDeveloper = developer;
        return true;
      }
      return false;
    },
    updateTaskStatus(task) {
      const developer = this.currentDeveloper;
      const index = developer.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        developer.tasks[index].status = task.status;
        this.categorizeTasks();
      }
    },
    categorizeTasks() {
      this.completedTasks = [];
      this.incompleteTasks = [];
      this.developers.forEach(dev => {
        dev.tasks.forEach(task => {
          if (task.status === 'completed') {
            this.completedTasks.push({ name: dev.name, task });
          } else {
            this.incompleteTasks.push({ name: dev.name, task });
          }
        });
      });
    }
  },
  getters: {
    getCompletedTasks(state) {
      return state.completedTasks;
    },
    getIncompleteTasks(state) {
      return state.incompleteTasks;
    }
  }
});
