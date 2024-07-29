<template>
  <div ref="vanta" class="tester-page">
    <div class="form-container">
      <h5>Tester Form</h5>
      <h5>Add bugs</h5>
      <!-- Add novalidate to prevent default browser validation -->
      <q-form @submit.prevent="onSubmit" novalidate>
        <q-input
          v-model="title"
          label="Title"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="description"
          label="Description"
          type="textarea"
          outlined
          class="q-mb-md"
        />
        <q-select
          v-model="priority"
          label="Priority"
          :options="priorities"
          outlined
          class="q-mb-md"
          use-input
        />
        <q-btn type="submit" label="Submit" color="primary" />
      <br /><br />
        <q-btn @click.prevent="onSubmit2"color="primary" type="submit" class="box" label="Logout"  />
      </q-form>
    </div>
    <div class="table-container">
      <h5>Added Bugs</h5>
      <q-table
        :rows="bugs"
        :columns="columns"
        row-key="title"
        flat
        bordered
        class="q-mt-md"
      />
    </div>
  </div>
</template>

<script>
import { useBugStore } from 'stores/bugStore';

export default {
  data() {
    return {
      title: '',
      description: '',
      priority: '',
      priorities: ['High', 'Low', 'Medium'],
      bugs: [],
      columns: [
        { name: 'title', required: true, label: 'Title', align: 'left', field: row => row.title },
        { name: 'description', label: 'Description', align: 'left', field: row => row.description },
        { name: 'priority', label: 'Priority', align: 'left', field: row => row.priority }
      ]
    };
  },
  methods: {
    onSubmit2() {
      this.$router.push({ name: 'StartPage' });
    },

    addBug() {
      if (this.title && this.description && this.priority) {
        const bugStore = useBugStore();
        bugStore.addBug({
          title: this.title,
          description: this.description,
          priority: this.priority
        });
        console.log('Bug added:', {
          title: this.title,
          description: this.description,
          priority: this.priority
        });
        this.bugs.push({
          title: this.title,
          description: this.description,
          priority: this.priority
        });
        this.title = '';
        this.description = '';
        this.priority = '';
      }
    },
    onSubmit() {
      if (this.title && this.description && this.priority) {
        this.addBug();
        alert('Bug submitted successfully!');
      } else {
        alert('Please fill out all fields.');
      }
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
          minHeight: 200.00,
          minWidth: 200.00,
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
  beforeDestroy() {
    if (this.vantaEffect) this.vantaEffect.destroy();
  }
};
</script>

<!-- <style scoped>
.tester-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.form-container,
.table-container {
  width: 300px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  border-radius: 8px;
  text-align: center;
}

/* Add margin to separate the containers */
.form-container {
  margin-right: 80px;
}

.q-table {
  margin-top: 20px;
}
</style> -->

<style scoped>
.tester-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
  flex-wrap: wrap; /* Added to allow wrapping on smaller screens */
}

.form-container,
.table-container {
  width: 300px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px; /* Added to ensure spacing on mobile screens */
}

/* Add margin to separate the containers */
.form-container {
  margin-right: 80px;
}

.q-table {
  margin-top: 20px;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .form-container {
    margin-right: 0;
    width: 90%; /* Adjusted width for better fit on mobile */
  }

  .table-container {
    width: 90%; /* Adjusted width for better fit on mobile */
  }
}
</style>
