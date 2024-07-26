<template>
  <div ref="vanta" class="admin-page">
    <div class="content">
      <div class="form-container">
        <h1>Admin</h1>
        <q-form @submit.prevent="onSubmit">
          <q-btn type="submit" class="box" :label="showBugTable ? 'Hide Bug List' : 'View/Edit Bug List'" color="primary" />
        </q-form>
        <br />
        <!-- <q-form @submit.prevent="onSubmit1">
          <q-btn type="submit" class="box" label="Assign Work to Developer" color="primary" />
        </q-form>
        <br /> -->
        <q-form @submit.prevent="onSubmit2">
          <q-btn type="submit" class="box" label="View Completed Task" color="primary" />
        </q-form>
        <br />
        <q-form @submit.prevent="onSubmit3">
          <q-btn type="submit" class="box" label="View Pending Task" color="primary" />
        </q-form>
      </div>

      <div v-if="showBugTable" class="overlay">
        <div class="bug-table-container">
          <h2>Bug List</h2>
          <div class="filter-sort-buttons">
            <q-btn-dropdown :label="priorityLabel" class="box" color="primary">
              <q-list>
                <q-item clickable @click="filterBugs('High')">
                  <q-item-section>High</q-item-section>
                </q-item>
                <q-item clickable @click="filterBugs('Medium')">
                  <q-item-section>Medium</q-item-section>
                </q-item>
                <q-item clickable @click="filterBugs('Low')">
                  <q-item-section>Low</q-item-section>
                </q-item>
                <q-item clickable @click="filterBugs('')">
                  <q-item-section>All</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn-dropdown :label="sortLabel" class="box" color="primary">
              <q-list>
                <q-item clickable @click="sortByPriority('asc')">
                  <q-item-section>Priority: Low to High</q-item-section>
                </q-item>
                <q-item clickable @click="sortByPriority('desc')">
                  <q-item-section>Priority: High to Low</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <q-table :rows="filteredBugs" :columns="columns" row-key="id">
            <template v-slot:body-cell-edit="props">
              <q-td :props="props">
                <q-btn @click="editBug(props.row.id)" label="Edit" class="box" color="primary" />
              </q-td>
            </template>
            <template v-slot:body-cell-title="props">
              <q-td :props="props">
                <q-input v-model="props.row.title" :readonly="!props.row.editing" dense />
              </q-td>
            </template>
            <template v-slot:body-cell-description="props">
              <q-td :props="props">
                <q-input v-model="props.row.description" :readonly="!props.row.editing" dense />
              </q-td>
            </template>
            <template v-slot:body-cell-priority="props">
              <q-td :props="props">
                <q-select
                  v-model="props.row.priority"
                  :options="priorityOptions"
                  emit-value
                  map-options
                  dense
                  :readonly="!props.row.editing"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-delete="props">
              <q-td :props="props">
                <q-btn @click="deleteBug(props.row.id)" label="Delete" class="box" color="primary" />
              </q-td>
            </template>
            <template v-slot:body-cell-assign="props">
              <q-td :props="props">
                <q-select
                  v-model="props.row.assignedTo"
                  :options="developerOptions"
                  emit-value
                  map-options
                  dense
                  @input="saveAllEdits"
                />
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
          <q-btn @click="saveAllEdits" label="Update" color="primary" class="update-btn" />
        </div>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useBugStore } from 'stores/bugStore';

export default {
  data() {
    return {
      showBugTable: false,
      selectedPriority: '',
      columns: [
        { name: 'id', required: true, label: 'Sr.no', align: 'left', field: row => row.id },
        { name: 'title', required: true, label: 'Title', align: 'left', field: row => row.title },
        { name: 'description', required: true, label: 'Description', align: 'left', field: row => row.description },
        { name: 'priority', required: true, label: 'Priority', align: 'left', field: row => row.priority },
        { name: 'edit', label: 'Edit', align: 'center' },
        { name: 'delete', label: 'Delete', align: 'center' },
        { name: 'assign', label: 'Assign', align: 'center' },
        { name: 'range', label: 'Range (Days)', align: 'center' }
      ],
      priorityOptions: [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
      ],
      developerOptions: [
        { label: 'ABC', value: 'ABC' },
        { label: 'rosh', value: 'rosh' }
      ],
      filteredBugs: [],
      sortBy: '',
      dateDialog: ref(false),
      selectedRow: ref(null),
      tempDates: ref({ from: '', to: '' })
    };
  },
  computed: {
    bugs() {
      const bugStore = useBugStore();
      return bugStore.bugs;
    },
    priorityLabel() {
      return this.selectedPriority ? `Priority: ${this.selectedPriority}` : 'Priority';
    },
    sortLabel() {
      if (this.sortBy === 'asc') {
        return 'Sort: Low to High';
      } else if (this.sortBy === 'desc') {
        return 'Sort: High to Low';
      } else {
        return 'Sort';
      }
    }
  },
  methods: {
    onSubmit() {
      this.showBugTable = !this.showBugTable;
      if (this.showBugTable) {
        this.filterBugs(this.selectedPriority);
      }
    },
    onSubmit1() {
      localStorage.setItem('bugListData', JSON.stringify(this.filteredBugs));
      this.$router.push({ name: 'AssignWorkPage' });
    },
    onSubmit2() {
      this.$router.push({ name: 'CompletePage' });
    },
    onSubmit3() {
      this.$router.push({ name: 'PendingPage' });
    },
    editBug(id) {
      const bugStore = useBugStore();
      const bug = bugStore.bugs.find(b => b.id === id);
      if (bug) {
        bug.editing = true;
      }
    },
    deleteBug(id) {
      const bugStore = useBugStore();
      const bug = bugStore.bugs.find(b => b.id === id);
      if (bug) {
        const confirmed = window.confirm('Are you sure you want to delete this bug permanently?');
        if (confirmed) {
          bugStore.deleteBug(id);
          this.reindexBugs();
          this.filterBugs(this.selectedPriority);
        }
      }
    },
    saveAllEdits() {
      const bugStore = useBugStore();
      bugStore.bugs.forEach(bug => {
        if (bug.editing) {
          bug.editing = false;
          bugStore.updateBug(bug);
          console.log('Updated bug:', bug);

          // Save tasks for rosh
          this.saveRoshTasks(bug);
        }
      });
      alert('Bugs updated successfully!');
      localStorage.setItem('bugListData', JSON.stringify(bugStore.bugs)); // Save to localStorage
      this.showBugTable = false;
    },
    filterBugs(priority) {
      this.selectedPriority = priority; // Set the selected priority
      if (priority === '') {
        this.filteredBugs = [...this.bugs];
      } else {
        this.filteredBugs = this.bugs.filter(bug => bug.priority === priority);
      }
      this.sortByPriority(this.sortBy);
    },
    sortByPriority(order) {
      this.sortBy = order;
      this.filteredBugs.sort((a, b) => {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        if (order === 'asc') {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
      });
    },
    reindexBugs() {
      const bugStore = useBugStore();
      bugStore.bugs.forEach((bug, index) => {
        bug.id = index + 1;
      });
    },
    showDateDialog(row) {
      this.selectedRow = row;
      this.tempDates = { from: row.startDate, to: row.endDate };
      this.dateDialog = true;
    },
    updateTempRange(dates) {
      this.tempDates = dates;
    },
    confirmDateSelection() {
      if (this.selectedRow) {
        this.selectedRow.startDate = this.tempDates.from;
        this.selectedRow.endDate = this.tempDates.to;
        this.updateRange(this.selectedRow);
        this.selectedRow = null;
      }
    },
    updateRange(row) {
      const startDate = new Date(row.startDate);
      const endDate = new Date(row.endDate);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      row.range = diffDays;
      row.deadline = `${row.startDate} to ${row.endDate}`; // Update deadline
    },
    getSliderColor(value) {
      if (value <= 3) {
        return 'red';
      } else if (value <= 7) {
        return 'yellow';
      } else {
        return 'green';
      }
    },

    // Method to handle saving tasks for "rosh"
    saveRoshTasks(row) {
      if (row.assignedTo === 'rosh') {
        console.log('Saving task for rosh:', row);
        storeRoshTasksInConsole(row);
      }
    }
  },
  watch: {
    selectedPriority(newPriority) {
      this.filterBugs(newPriority);
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
      document.head.appendChild(script2);
    };
    document.head.appendChild(script1);
  },
};

const storeRoshTasksInConsole = (task) => {
  if (!console.tasks) {
    console.tasks = [];
  }
  console.tasks.push(task);
};
</script>

<!-- <style scoped>
.admin-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  overflow: hidden;
}
.content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-container {
  width: 300px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  max-width: 800px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  margin: 0 auto;
  overflow-x: auto; /* Ensure that overflow is handled */
}

.q-table {
  width: 100%;
  table-layout: fixed; /* Ensures table columns fit within the container */
}

.filter-sort-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-left: 150px;
  margin-right: 150px;
}
.update-btn {
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  margin-left: 350px;
  border-radius: 10px;
}
.box {
  border-radius: 10px;
}
</style> -->
<!-- <style scoped>
.admin-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  overflow: hidden;
}

.content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-container {
  width: 300px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  max-width: 800px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  margin: 0 auto;
  overflow-x: auto; /* Ensure that overflow is handled */
}

.q-table {
  width: 100%;
  table-layout: fixed; /* Ensures table columns fit within the container */
}

.filter-sort-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-left: 150px;
  margin-right: 150px;
}

.update-btn {
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  margin-left: 350px;
  border-radius: 10px;
}

.box {
  border-radius: 10px;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .content {
    width: 100%;
    padding: 10px;
  }

  .form-container {
    width: 90%;
    margin-bottom: 20px;
  }

  .bug-table-container {
    width: 90%;
    max-width: 100%;
    padding: 10px;
  }

  .filter-sort-buttons {
    flex-direction: column;
    margin: 10px 0;
    align-items: center;
  }

  .filter-sort-buttons .q-btn-dropdown {
    width: 100%;
    margin-bottom: 10px;
  }

  .update-btn {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
  .q-td {
  padding: 10px; /* Adds space between the columns */
}
  .q-table {
    font-size: 0.8em;
  }
}
</style> -->
<style scoped>
.admin-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  overflow: hidden;
}

.content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-container {
  width: 300px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  max-width: 800px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0px 25px rgba(251, 255, 0, 0.989);
  margin: 0 auto;
  overflow-x: auto; /* Ensure that overflow is handled */
}

.q-table {
  width: 100%;
  table-layout: fixed; /* Ensures table columns fit within the container */
  border-spacing: 0 10px; /* Adds space between the rows */
}

.q-td {
  padding: 10px; /* Adds space between the columns */
}

.filter-sort-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-left: 150px;
  margin-right: 150px;
}

.update-btn {
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  margin-left: 350px;
  border-radius: 10px;
}

.box {
  border-radius: 10px;
}

/* Mobile Responsive Styles */
@media (max-width: 600px) {
  .content {
    width: 100%;
    padding: 10px;
  }

  .form-container {
    width: 90%;
    margin-bottom: 20px;
  }

  .bug-table-container {
    width: 90%;
    max-width: 100%;
    padding: 10px;
  }

  .filter-sort-buttons {
    flex-direction: column;
    margin: 10px 0;
    align-items: center;
  }

  .filter-sort-buttons .q-btn-dropdown {
    width: 100%;
    margin-bottom: 10px;
  }

  .update-btn {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }

  .q-table {
    font-size: 0.8em;
  }
}
</style>
