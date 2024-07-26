<template>
  <div ref="vanta" class="admin-page">
    <div class="content">
      <div class="form-container">
        <h1>Assign Task</h1>
        <div class="bug-table-container">
          <q-table :rows="devname" :columns="columns" row-key="id">
            <template v-slot:body-cell-task="props">
              <q-td :props="props">
                <q-input v-model="props.row.task" dense />
              </q-td>
            </template>
            <template v-slot:body-cell-range="props">
              <q-td :props="props">
                <q-slider
                  v-model.number="props.row.range"
                  label
                  label-always
                  :color="getSliderColor(props.row.range)"
                  min="1"
                  max="10"
                  dense
                  style="width: 200px; display: inline-block; vertical-align: middle; margin-left: 10px;"
                >
                  <template v-slot:append>
                    <div>{{ props.row.range }} day{{ props.row.range !== 1 ? 's' : '' }} left</div>
                  </template>
                </q-slider>
                <q-btn dense round icon="event" @click="showDateDialog(props.row)" style="margin-left: 10px;" />
              </q-td>
            </template>
          </q-table>
        </div>
        <br />
        <q-btn type="submit" @click="onSubmit" label="update" color="primary" class="update-btn" />
      </div>
      <q-dialog v-model="dateDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Select Start and End Dates</div>
          </q-card-section>
          <q-card-section>
            <q-date v-model="tempDates" mask="YYYY-MM-DD" range @input="updateTempRange" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="OK" @click="confirmDateSelection" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { useDeveloperStore } from 'stores/developerStore';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  setup() {
    const bugListData = JSON.parse(localStorage.getItem('bugListData')) || [];
    // const devname = ref(bugListData); // Assign bugs data to devname
    const devname = ref([
      { id: 1, devname: 'ABC', task: '', range: 1, startDate: '', endDate: '' },
      { id: 2, devname: 'CDE', task: '', range: 1, startDate: '', endDate: '' },
      { id: 3, devname: 'EFG', task: '', range: 1, startDate: '', endDate: '' }
    ]);
    const columns = ref([
      { name: 'id', required: true, label: 'SR NO', align: 'left', field: row => row.id },
      { name: 'devname', required: true, label: 'devname', align: 'left', field: row => row.devname },
      { name: 'task', required: true, label: 'Task', align: 'left', field: row => row.task },
      { name: 'range', required: true, label: 'Range (Days)', align: 'left', field: row => row.range }
    ]);
    const dateDialog = ref(false);
    const selectedRow = ref(null);
    const tempDates = ref({ from: '', to: '' });

    const getSliderColor = value => {
      if (value <= 3) {
        return 'red';
      } else if (value <= 7) {
        return 'yellow';
      } else {
        return 'green';
      }
    };

    const showDateDialog = row => {
      selectedRow.value = row;
      tempDates.value = { from: row.startDate, to: row.endDate };
      dateDialog.value = true;
    };

    const updateTempRange = dates => {
      tempDates.value = dates;
    };

    const confirmDateSelection = () => {
      if (selectedRow.value) {
        selectedRow.value.startDate = tempDates.value.from;
        selectedRow.value.endDate = tempDates.value.to;
        updateRange(selectedRow.value);

        if (!developerStore.developers.some(dev => dev.name === selectedRow.value.devname)) {
          developerStore.addDeveloper(selectedRow.value.devname);
        }

        selectedRow.value = null;
      }
    };

    const updateRange = row => {
      const startDate = new Date(row.startDate);
      const endDate = new Date(row.endDate);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      row.range = diffDays;
    };

    const onSubmit = () => {
  alert("Done");
  devname.value.forEach(dev => {
    developerStore.assignTask(dev.devname, dev.task, dev.range, dev.startDate, dev.endDate);
  });
  console.log('Assigned developers and tasks:', developerStore.developers);
};


    let vantaEffect;

    onMounted(() => {
      const script1 = document.createElement('script');
      script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/gh/tengbao/vanta@latest/dist/vanta.birds.min.js';
        script2.onload = () => {
          vantaEffect = window.VANTA.BIRDS({
            el: document.querySelector('.admin-page'),
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
    });

    onBeforeUnmount(() => {
      if (vantaEffect) vantaEffect.destroy();
    });

    return {
      devname,
      columns,
      dateDialog,
      selectedRow,
      tempDates,
      getSliderColor,
      showDateDialog,
      updateTempRange,
      confirmDateSelection,
      updateRange,
      onSubmit
    };
  }
};
</script>

<style scoped>
.admin-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  overflow: hidden; /* Ensure the background covers the entire page */
}
.content {
  z-index: 1; /* Ensure content is above the background */
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-container {
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);

  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the buttons */
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.bug-table-container {
  width: 100%;
  margin-bottom: 20px;
}
.filter-sort-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 20px; /* Adjust the value to control the distance between the buttons */
}
.update-btn {
  margin-top: 20px;
  align-self: center;
}
</style>
