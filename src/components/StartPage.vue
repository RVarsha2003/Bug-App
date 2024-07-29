start page 
<template>
  <div class="start-page" ref="vanta">
    <div class="form-container">
      <img src="/R.jpeg" alt="R Icon" class="R-icon" />
      <q-form @submit="onSubmit">
        <q-input
          v-model="name"
          label="Name"
          outlined
          :rules="[val => !!val || 'Name is required']"
          class="q-mb-md"
        />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          outlined
          :rules="[val => !!val || 'Password is required']"
          class="q-mb-md"
        />
        <q-btn type="submit" class="car" label="Login" color="primary" />
      </q-form>
    </div>
  </div>
</template>

<script>
import { useUserStore } from 'stores/userStore'; // Adjust the path as necessary

export default {
  data() {
    return {
      name: '',
      password: '',
      vantaEffect: null
    };
  },
  methods: {
    onSubmit() {
      const userStore = useUserStore();
      const authenticatedName = userStore.authenticate(this.name, this.password);

      if (authenticatedName) {
        // Navigate to the page based on the authenticated user's role
        if (authenticatedName === 'Tester') {
          this.$router.push({ name: 'TesterPage' });
        } else if (authenticatedName === 'Developer') {
          this.$router.push({ name: 'DeveloperPage' });
        } else if (authenticatedName === 'Admin') {
          this.$router.push({ name: 'AdminPage' });
        }
      } else {
        // Handle authentication failure (e.g., show an error message)
        alert('Invalid credentials');
      }
    }
  },
  mounted() {
    // Dynamically load the external scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://cdn.jsdelivr.net/gh/tengbao/vanta@latest/dist/vanta.birds.min.js';
      script2.onload = () => {
        // Initialize Vanta.js after the scripts have loaded
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

<style scoped>
.start-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-container {
  width: 300px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0px 25px rgba(193, 196, 13, 0.989);
  border-radius: 8px;
  text-align: center;
}

.R-icon {
  width: 150px;
  height: auto;
  background-color: rgba(237, 37, 37, 0.9);
  margin-bottom: 20px;
  border-radius: 20px;
  opacity: 0.9;
}

.car {
  border-radius: 10px;
}
</style>
