<template>
  <div ref="vanta" class="DeveloperPage">
    <div class="container">
      <template v-if="!showTasks">
        <h2>Developer Login</h2>
        <form @submit.prevent="login">
          <div>
            <label for="devname">Dev Name:</label>
            <input type="text" v-model.trim="devname" id="devname" required list="developerNames">
            <datalist id="developerNames">
              <option v-for="developer in developerOptions" :key="developer.value" :value="developer.label" />
            </datalist>
          </div> <br />
          <div>
            <label for="password">Password:</label>
            <input type="password" v-model.trim="password" id="password" required minlength="6" maxlength="6">
          </div><br />
          <button type="submit" style="margin-right: 20px;">Login</button>
          <q-btn @click.prevent="onSubmit2" type="submit" class="box" label="Logout" />
        </form>
      </template>
      <template v-else>
        <div v-if="currentDeveloper">
          <h2>Task List for {{ currentDeveloper.name }}</h2>
          <template v-if="currentDeveloper.tasks.length > 0">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th> <!-- Updated column header -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(task, index) in currentDeveloper.tasks" :key="task.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ task.title }}</td>
                  <td>{{ task.description }}</td>
                  <td>{{ task.priority }}</td>
                  <td>
                    <select v-model="task.status" @change="updateTaskStatus(task)">
                      <option value="completed">Completed</option>
                      <option value="incomplete">Incomplete</option>
                    </select>
                    <span :class="getStatusClass(task.status)">
                      {{ task.status === 'completed' ? '✔' : '✖' }}
                    </span>
                  </td>
                  <td>{{ formatDate(task.startDate) }}</td>
                  <td>{{ formatDate(task.endDate) }}</td>
                  <td> <!-- Updated column for the days block -->
                    <div class="block-container">
                      <div v-for="n in calculateDays(task.startDate, task.endDate)" :key="n" class="block" :style="getBlockStyle(n)">
                        {{ n }}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table><br/>
            <button @click="updateTasks">Update</button>
          </template>
          <div v-else>
            No tasks assigned.
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';

export default {
  methods: {
    onSubmit2() {
      this.$router.push({ name: 'StartPage' });
    },
  },
  setup() {
    const devname = ref('');
    const password = ref(''); // New password field
    const showTasks = ref(false);
    const developerOptions = ref([
      { label: 'ABC', value: 'ABC' },
      { label: 'rosh', value: 'rosh' }
    ]);
    const currentDeveloper = ref(null);

    const login = () => {
      const trimmedName = devname.value.trim().toLowerCase();
      if (trimmedName === 'rosh' && password.value !== '123456') {
        alert('Invalid password for Rosh');
        return;
      }
      if (password.value.length !== 6) {
        alert('Password must be exactly 6 characters long.');
        return;
      }
      if (trimmedName === 'rosh') {
        handleRoshLogin();
      } else {
        handleOtherLogin(trimmedName.toUpperCase());
      }
    };

    const handleRoshLogin = () => {
      currentDeveloper.value = {
        name: 'Rosh',
        tasks: [
          {
            assignedTo: 'rosh',
            title: 'mouse',
            description: 'mouse',
            priority: 'Low',
            status: 'incomplete',
            startDate: '07-27-2024',
            endDate: '07-30-2024',
          }
        ]
      };
      console.log('Logged in successfully: Rosh');
      showTasks.value = true;
    };

    const handleOtherLogin = (name) => {
      const developer = developerOptions.value.find(dev => dev.label.toUpperCase() === name);
      if (developer) {
        currentDeveloper.value = getDeveloper(developer.label);
        if (currentDeveloper.value) {
          console.log(`Logged in successfully: ${name}`);
          showTasks.value = true;
        } else {
          alert('No tasks assigned to this developer');
        }
      } else {
        alert('Invalid dev name');
      }
    };

    const getDeveloper = (name) => {
      if (name.toLowerCase() === 'rosh') {
        const roshTasks = console.tasks ? console.tasks.filter(task => task.assignedTo === 'rosh') : [];
        console.log('Retrieved tasks for rosh from console:', roshTasks);
        if (roshTasks.length > 0) {
          return { name, tasks: roshTasks.map(task => ({ ...task, status: task.status || 'incomplete' })) };
        }
        return null;
      } else {
        const bugs = JSON.parse(localStorage.getItem('bugListData') || '[]');
        console.log('Retrieved bugs from localStorage:', bugs);
        const tasks = bugs.filter(bug => bug.assignedTo.toUpperCase() === name.toUpperCase()).map(task => {
          if (!task.status) {
            task.status = 'incomplete'; // Set default status to incomplete
          }
          return task;
        });
        console.log(`Tasks assigned to ${name}:`, tasks);
        return tasks.length > 0 ? { name, tasks } : null;
      }
    };

    const updateTaskStatus = (task) => {
      const bugs = JSON.parse(localStorage.getItem('bugListData') || '[]');
      const bug = bugs.find(b => b.id === task.id);
      if (bug) {
        bug.status = task.status;
        localStorage.setItem('bugListData', JSON.stringify(bugs));
      }
    };

    const updateTasks = () => {
      const bugs = JSON.parse(localStorage.getItem('bugListData') || '[]');
      currentDeveloper.value.tasks.forEach(task => {
        const bug = bugs.find(b => b.id === task.id);
        if (bug) {
          bug.status = task.status;
        } else {
          bugs.push(task);
        }
      });
      localStorage.setItem('bugListData', JSON.stringify(bugs));
      alert('Tasks updated successfully');
      showTasks.value = false;
      devname.value = '';
      password.value = ''; // Reset password field
    };

    const getStatusClass = (status) => {
      return status === 'completed' ? 'status-completed' : 'status-incomplete';
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end - start;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // Added +1 to include the last day
  return daysDiff;
};

    // const calculateDays = (startDate, endDate) => {
    //   const start = new Date(startDate);
    //   const end = new Date(endDate);
    //   const timeDiff = end - start;
    //   const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    //   return daysDiff;
    // };

    const getBlockStyle = (day) => {
      const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A6',
        '#33FFF7', '#F7FF33', '#FF8C33', '#B833FF', '#33FF83', '#FF3380'
      ];
      return {
        backgroundColor: colors[(day - 1) % colors.length],
        color: 'black', // Changed to black
        padding: '5px',
        borderRadius: '4px',
        margin: '2px', // Adjusted for horizontal spacing
        width: '20px',
        textAlign: 'center',
        display: 'inline-block' // Ensure blocks are inline
      };
    };

    onMounted(() => {
      const script1 = document.createElement('script');
      script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/gh/tengbao/vanta@latest/dist/vanta.birds.min.js';
        script2.onload = () => {
          window.VANTA.BIRDS({
            el: document.querySelector('.DeveloperPage'),
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: window.innerHeight,
            minWidth: window.innerWidth,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0x0,
            color2: 0xfffaa7,
            colorMode: "lerp",
            birdSize: 1.5,
            wingSpan: 12.00,
            speedLimit: 3.00,
            separation: 85.00,
            alignment: 79.00,
            cohesion: 57.00,
            quantity: 4
          });
        };
        document.head.appendChild(script2);
      };
      document.head.appendChild(script1);
    });

    return {
      devname,
      password, // Include password in return
      showTasks,
      developerOptions,
      login,
      updateTaskStatus,
      updateTasks,
      getStatusClass,
      currentDeveloper,
      formatDate,
      calculateDays,
      getBlockStyle
    };
  }
};
</script>

<style scoped>
.DeveloperPage {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.container {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  margin: auto;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  box-sizing: border-box;
}

form {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.status-completed {
  color: green;
  font-size: 1.5em;
  font-weight: 1.3em;
}

.status-incomplete {
  color: rgb(226, 0, 0);
  font-size: 1.3em;
  font-weight: 1.3em;
}

.block-container {
  display: flex;
}

.block {
  background-color: #ff5733;
  color: black;
  padding: 5px;
  border-radius: 4px;
  margin: 2px;
  width: 20px;
  text-align: center;
  display: inline-block;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .container {
    padding: 10px !important;
    max-width: 100% !important;
    box-shadow: none !important;
    top: auto !important;
    left: auto !important;
    transform: none !important;
    width: calc(100% - 40px) !important;
    height: auto !important;
    margin: 20px auto !important;
    position: relative !important;
  }

  h2 {
    font-size: 1.5em !important;
    text-align: center !important;
  }

  form {
    margin-bottom: 10px !important;
  }

  label {
    display: block !important;
    margin-bottom: 5px !important;
  }

  input {
    width: 100% !important;
    padding: 8px !important;
    margin-bottom: 10px !important;
    box-sizing: border-box !important;
  }

  button {
    width: 100% !important;
    padding: 10px !important;
    margin-bottom: 10px !important;
  }

  table {
    font-size: 0.8em !important;
  }

  th, td {
    padding: 4px !important;
  }

  .status-completed, .status-incomplete {
    font-size: 1.2em !important;
  }
}

@media (max-width: 600px) {
  .container {
    box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989)
  !important;
  }
}
</style>









<!-- <style scoped>
.DeveloperPage {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.container {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  margin: auto;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  box-sizing: border-box;
}

form {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.status-completed {
  color: green;
  font-size: 1.5em;
  font-weight: 1.3em;
}

.status-incomplete {
  color: rgb(226, 0, 0);
  font-size: 1.3em;
  font-weight: 1.3em;
}

.block-container {
  display: flex; /* Ensures the blocks are displayed horizontally */
}

.block {
  background-color: #ff5733;
  color: black; /* Changed to black */
  padding: 5px;
  border-radius: 4px;
  margin: 2px; /* Adjusted for horizontal spacing */
  width: 20px;
  text-align: center;
  display: inline-block;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .container {
    padding: 10px !important;
    max-width: 90% !important;
    box-shadow: none !important;
    top: 0 !important;
    left: 0 !important;
    transform: none !important;
    width: 100% !important;
    height: auto !important;
    margin: 20px auto !important;
  }

  h2 {
    font-size: 1.5em !important;
    text-align: center !important;
  }

  form {
    margin-bottom: 10px !important;
  }

  label {
    display: block !important;
    margin-bottom: 5px !important;
  }

  input {
    width: 100% !important;
    padding: 8px !important;
    margin-bottom: 10px !important;
    box-sizing: border-box !important;
  }

  button {
    width: 100% !important;
    padding: 10px !important;
    margin-bottom: 10px !important;
  }

  table {
    font-size: 0.8em !important;
  }

  th, td {
    padding: 4px !important;
  }

  .status-completed, .status-incomplete {
    font-size: 1.2em !important;
  }
}
</style> -->















<!-- <style scoped>
.DeveloperPage {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.container {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  margin: auto;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  box-sizing: border-box;
}

form {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.status-completed {
  color: green;
  font-size: 1.5em;
  font-weight: 1.3em;
}

.status-incomplete {
  color: rgb(226, 0, 0);
  font-size: 1.3em;
  font-weight: 1.3em;
}
</style> -->
<!-- <style scoped>
.DeveloperPage {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.container {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  margin: auto;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  box-sizing: border-box;
}

form {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.status-completed {
  color: green;
  font-size: 1.5em;
  font-weight: 1.3em;
}

.status-incomplete {
  color: rgb(226, 0, 0);
  font-size: 1.3em;
  font-weight: 1.3em;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .container {
    padding: 10px;
    max-width: 90%;
    box-shadow: none;
    top: 0;
    left: 0;
    transform: none;
    width: 100%;
    height: auto;
    margin: 20px auto;
  }

  h2 {
    font-size: 1.5em;
    text-align: center;
  }

  form {
    margin-bottom: 10px;
  }

  table {
    font-size: 0.8em;
  }

  th, td {
    padding: 4px;
  }

  .status-completed, .status-incomplete {
    font-size: 1.2em;
  }

  button {
    width: 100%;
  }
}
</style> -->

