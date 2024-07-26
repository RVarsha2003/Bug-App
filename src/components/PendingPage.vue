<template>
  <div class="pending-page">
    <div class="vanta-box" ref="vanta"></div>
    <div class="content-container">
      <h2 class="don">Pending Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Developer Name</th>
            <th>Task</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(taskItem, index) in pendingTasksWithPredefined" :key="index">
            <td>{{ taskItem.assignedTo }}</td>
            <td>{{ taskItem.title }}</td>
            <td>{{ taskItem.description }}</td>
            <td>{{ taskItem.priority }}</td>
            <td>{{ taskItem.status }}</td>
            <td>{{ formatDate(taskItem.startDate) }}</td>
            <td>{{ formatDate(taskItem.endDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PendingPage',
  data() {
    return {
      vantaEffect: null,
    };
  },
  computed: {
    pendingTasks() {
      const bugs = JSON.parse(localStorage.getItem('bugListData') || '[]');
      return bugs.filter(bug => bug.status === 'incomplete');
    },
    pendingTasksWithPredefined() {
      const predefinedTask = {
        assignedTo: 'rosh',
        title: 'bike',
        description: 'bike',
        priority: 'Low',
        status: 'incomplete',
        startDate: '07-27-2024',
        endDate: '07-30-2024',
      };
      return [predefinedTask, ...this.pendingTasks];
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  },
  mounted() {
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://cdn.jsdelivr.net/gh/tengbao/vanta@latest/dist/vanta.birds.min.js';
      script2.onload = () => {
        this.vantaEffect = window.VANTA.BIRDS({
          el: this.$refs.vanta,
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
      document.body.appendChild(script2);
    };
    document.body.appendChild(script1);
  },
  beforeUnmount() {
    if (this.vantaEffect) this.vantaEffect.destroy();
  }
};
</script>

<!-- <style scoped>
.pending-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.vanta-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.content-container {
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  max-width: 1200px;
  width: 100%;
  overflow: auto;
  align-items: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
}

th, td {
  border-top: 1px solid #080303;
  border-bottom: 1px solid #080303;
  padding: 8px;
  text-align: left;
  border-left: none;
  border-right: none;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

.don {
  align-items: center;
}
</style> -->

<style scoped>
.pending-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.vanta-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.content-container {
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  max-width: 1200px;
  width: 100%;
  overflow: auto;
  align-items: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
}

th, td {
  border-top: 1px solid #080303;
  border-bottom: 1px solid #080303;
  padding: 8px;
  text-align: left;
  border-left: none;
  border-right: none;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

.don {
  align-items: center;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .content-container {
    padding: 10px;
    border-radius: 5px;
  }

  h2.don {
    font-size: 1.5em;
  }

  th, td {
    padding: 4px;
    font-size: 0.8em;
  }

  table {
    font-size: 0.8em;
  }
}
</style>

