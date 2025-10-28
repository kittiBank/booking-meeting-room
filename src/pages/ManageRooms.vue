<template>
  <div class="container">
    <h1 class="title">Manage Rooms</h1>

    <!-- Add / Edit Room Form -->
    <div class="room-form">
      <h2>{{ isEdit ? "Edit Room" : "Add Room" }}</h2>
      <form @submit.prevent="saveRoom" class="form-inline">
        <input
          v-model="currentRoom.name"
          type="text"
          placeholder="Room Name"
          required
          class="input"
        />
        <input
          v-model.number="currentRoom.capacity"
          type="number"
          placeholder="Capacity"
          required
          min="1"
          class="input"
        />
        <select v-model="currentRoom.status" class="input">
          <option>Available</option>
          <option>Maintenance</option>
          <option>Closed</option>
        </select>
        <button type="submit" class="btn save">
          {{ isEdit ? "Update" : "Add" }}
        </button>
        <button
          type="button"
          class="btn cancel"
          v-if="isEdit"
          @click="resetForm"
        >
          Cancel
        </button>
      </form>
    </div>

    <!-- Room Table -->
    <div class="table-wrapper">
      <table class="room-table">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Name</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>{{ room.id }}</td>
            <td>{{ room.name }}</td>
            <td>{{ room.capacity }}</td>
            <td>
              <span :class="['status', statusClass(room.status)]">{{
                room.status
              }}</span>
            </td>
            <td>
              <button class="btn edit" @click="editRoom(room)">Edit</button>
              <button class="btn cancel" @click="deleteRoom(room)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const rooms = ref([
  { id: 1, name: "Meeting A", capacity: 10, status: "Available" },
  { id: 2, name: "Meeting B", capacity: 20, status: "Maintenance" },
  { id: 3, name: "Meeting C", capacity: 15, status: "Closed" },
]);

const currentRoom = ref({ name: "", capacity: 1, status: "Available" });
const isEdit = ref(false);

const saveRoom = () => {
  if (isEdit.value) {
    // Update
    const index = rooms.value.findIndex((r) => r.id === currentRoom.value.id);
    if (index !== -1) rooms.value[index] = { ...currentRoom.value };
  } else {
    // Add new
    const newId = rooms.value.length
      ? Math.max(...rooms.value.map((r) => r.id)) + 1
      : 1;
    rooms.value.push({ ...currentRoom.value, id: newId });
  }
  resetForm();
};

const editRoom = (room) => {
  currentRoom.value = { ...room };
  isEdit.value = true;
};

const resetForm = () => {
  currentRoom.value = { name: "", capacity: 1, status: "Available" };
  isEdit.value = false;
};

const deleteRoom = (room) => {
  if (confirm(`Are you sure you want to delete room "${room.name}"?`)) {
    rooms.value = rooms.value.filter((r) => r.id !== room.id);
  }
};

const statusClass = (status) => {
  switch (status) {
    case "Available":
      return "available";
    case "Maintenance":
      return "maintenance";
    case "Closed":
      return "closed";
    default:
      return "";
  }
};
</script>

<style>
.container {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
  background: #f9f9f9;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.room-form {
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.room-form h2 {
  font-size: 20px;
  margin-bottom: 12px;
}

.form-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.input {
  padding: 10px 14px;
  height: 42px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  flex: 1;
  min-width: 120px;
  box-sizing: border-box;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}
.btn.save {
  background-color: #2ecc71;
  color: #fff;
}
.btn.save:hover {
  background-color: #27ae60;
}
.btn.edit {
  background-color: #4a90e2;
  color: #fff;
}
.btn.edit:hover {
  background-color: #357abd;
}
.btn.cancel {
  background-color: #e94b3c;
  color: #fff;
}
.btn.cancel:hover {
  background-color: #c0392b;
}

.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.room-table {
  width: 100%;
  border-collapse: collapse;
}
.room-table th,
.room-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
}
.room-table thead {
  background: #f0f0f0;
}
.room-table tbody tr:hover {
  background: #f5f5f5;
}

.status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}
.status.available {
  background: #e0f7e9;
  color: #2d9a4b;
}
.status.maintenance {
  background: #fff4e5;
  color: #d27f00;
}
.status.closed {
  background: #fdecea;
  color: #d93025;
}

/* Responsive */
@media (max-width: 768px) {
  .form-inline {
    flex-direction: column;
  }
  .input {
    width: 100%;
  }
}
</style>
