<template>
  <div class="container">
    <h1 class="title">Manage Bookings</h1>

    <!-- Filter / Search -->
    <div class="filter">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name or room"
      />
      <input v-model="filterDate" type="date" />
    </div>

    <!-- Booking Table -->
    <div class="table-wrapper">
      <table class="booking-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Name</th>
            <th>Room</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in filteredBookings" :key="booking.id">
            <td>{{ booking.id }}</td>
            <td>{{ booking.user }}</td>
            <td>{{ booking.room_name }}</td>
            <td>{{ formatDate(booking.start_date) }}</td>
            <td>{{ formatTimeRange(booking.start_time, booking.end_time) }}</td>
            <td>
              <span :class="['status', statusClass(booking.status)]">{{
                booking.status
              }}</span>
            </td>
            <td>
              <button class="btn edit" @click="openEditModal(booking)">
                Edit
              </button>
              <button class="btn cancel" @click="cancelBooking(booking)">
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal">
        <h2>Edit Booking</h2>
        <div class="modal-form">
          <label>Name</label>
          <input v-model="editForm.user" type="text" />

          <label>Room</label>
          <select v-model="editForm.room_id">
            <option v-for="room in rooms" :key="room.id" :value="room.id">
              {{ room.name }}
            </option>
          </select>

          <label>Start Date</label>
          <input v-model="editForm.start_date" type="date" />

          <label>Start Time</label>
          <select v-model="editForm.start_time">
            <option v-for="slot in timeSlots" :key="slot" :value="slot">
              {{ slot }}
            </option>
          </select>

          <label>End Date</label>
          <input v-model="editForm.end_date" type="date" />

          <label>End Time</label>
          <select v-model="editForm.end_time">
            <option v-for="slot in timeSlots" :key="slot" :value="slot">
              {{ slot }}
            </option>
          </select>

          <div class="modal-actions">
            <button @click="showEditModal = false">Cancel</button>
            <button @click="submitEdit">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";

interface Booking {
  id: number;
  room_id: number;
  room_name: string;
  user: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  status: string;
}

interface Room {
  id: number;
  name: string;
}

const bookings = ref<Booking[]>([]);
const rooms = ref<Room[]>([]);
const search = ref("");
const filterDate = ref("");

// Modal
const showEditModal = ref(false);
const editForm = ref<Booking>({
  id: 0,
  room_id: 0,
  room_name: "",
  user: "",
  start_date: "",
  start_time: "",
  end_date: "",
  end_time: "",
  status: "Confirmed",
});

// Time slots
const timeSlots = [
  "09:00:00",
  "10:00:00",
  "11:00:00",
  "12:00:00",
  "13:00:00",
  "14:00:00",
  "15:00:00",
  "16:00:00",
  "17:00:00",
];

// Fetch bookings & rooms
const fetchRooms = async () => {
  try {
    const res = await axios.get<Room[]>("http://localhost:5001/api/rooms");
    rooms.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const fetchBookings = async () => {
  try {
    const res = await axios.get<Booking[]>(
      "http://localhost:5001/api/bookings"
    );
    bookings.value = res.data.map((b) => ({
      id: b.id,
      room_id: b.room_id,
      room_name: b.room || "Unknown",
      user: b.user || "Unknown",
      start_date: b.start_date,
      start_time: b.start_time,
      end_date: b.end_date,
      end_time: b.end_time,
      status: b.status || "Confirmed",
    }));
  } catch (err) {
    console.error(err);
  }
};

// Filtered bookings
const filteredBookings = computed(() => {
  return bookings.value.filter((b) => {
    const matchesSearch =
      b.user.toLowerCase().includes(search.value.toLowerCase()) ||
      b.room_name.toLowerCase().includes(search.value.toLowerCase());
    const matchesDate = filterDate.value
      ? b.start_date.startsWith(filterDate.value)
      : true;
    return matchesSearch && matchesDate;
  });
});

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

// Format time
const formatTimeRange = (startTime: string, endTime: string) => {
  return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
};

// Status class
const statusClass = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "confirmed";
    case "Pending":
      return "pending";
    case "Cancelled":
      return "cancelled";
    default:
      return "";
  }
};

// Open edit modal
const openEditModal = (booking: Booking) => {
  editForm.value = { ...booking };
  showEditModal.value = true;
};

// Submit edit
const submitEdit = async () => {
  try {
    const res = await axios.put(
      `http://localhost:5001/api/bookings/${editForm.value.id}`,
      editForm.value
    );
    const index = bookings.value.findIndex((b) => b.id === editForm.value.id);
    if (index !== -1) {
      bookings.value[index] = {
        ...bookings.value[index],
        ...editForm.value,
        room_name:
          rooms.value.find((r) => r.id === editForm.value.room_id)?.name ||
          editForm.value.room_name,
      };
    }
    showEditModal.value = false;
    alert("Booking updated successfully!");
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to update booking");
    console.error(err);
  }
};

// Cancel booking
const cancelBooking = async (booking: Booking) => {
  if (!confirm(`Are you sure you want to cancel booking ID ${booking.id}?`))
    return;
  try {
    await axios.delete(`http://localhost:5001/api/bookings/${booking.id}`);
    bookings.value = bookings.value.filter((b) => b.id !== booking.id);
    alert("Booking cancelled successfully!");
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to cancel booking");
    console.error(err);
  }
};

onMounted(() => {
  fetchRooms();
  fetchBookings();
});
</script>

<style>
.container {
  max-width: 1000px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}
.title {
  font-size: 28px;
  margin-bottom: 20px;
}
.filter {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.filter input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.table-wrapper {
  overflow-x: auto;
}
.booking-table {
  width: 100%;
  border-collapse: collapse;
}
.booking-table th,
.booking-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}
.booking-table thead {
  background: #f0f0f0;
}
.booking-table tbody tr:hover {
  background: #f5f5f5;
}
.status {
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 12px;
}
.status.confirmed {
  background: #e0f7e9;
  color: #2d9a4b;
}
.status.pending {
  background: #fff4e5;
  color: #d27f00;
}
.status.cancelled {
  background: #fdecea;
  color: #d93025;
}
.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 3px;
  font-size: 13px;
}
.btn.edit {
  background: #4a90e2;
  color: #fff;
}
.btn.edit:hover {
  background: #357abd;
}
.btn.cancel {
  background: #e94b3c;
  color: #fff;
}
.btn.cancel:hover {
  background: #c0392b;
}
.modal-overlay {
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
.modal {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  width: 400px;
}
.modal-form label {
  display: block;
  margin-top: 10px;
}

.modal-form input,
.modal-form select {
  width: 100%;
  padding: 8px 10px;
  margin-top: 3px;
  height: 38px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.modal-actions button {
  margin-left: 5px;
}
</style>
