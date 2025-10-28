<template>
  <div class="booking-room">
    <h1>Booking Room</h1>

    <!-- Top bar booking form -->
    <div class="top-bar-form">
      <!-- Room -->
      <div class="form-group">
        <label>Room</label>
        <select v-model="selectedRoom">
          <option disabled value="">Select Room</option>
          <option v-for="room in rooms" :key="room.id" :value="room.id">
            {{ room.name }} (Capacity: {{ room.capacity }})
          </option>
        </select>
      </div>

      <!-- Full Name -->
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" v-model="fullName" />
      </div>

      <!-- Start Date -->
      <div class="form-group">
        <label>Start Date</label>
        <input type="date" v-model="startDate" />
      </div>

      <!-- Start Time -->
      <div class="form-group">
        <label>Start Time</label>
        <select v-model="startTime">
          <option disabled value="">Select Start Time</option>
          <option v-for="slot in timeSlots" :key="slot" :value="slot">
            {{ slot }}
          </option>
        </select>
      </div>

      <!-- End Date -->
      <div class="form-group">
        <label>End Date</label>
        <input type="date" v-model="endDate" />
      </div>

      <!-- End Time -->
      <div class="form-group">
        <label>End Time</label>
        <select v-model="endTime">
          <option disabled value="">Select End Time</option>
          <option v-for="slot in timeSlots" :key="slot" :value="slot">
            {{ slot }}
          </option>
        </select>
      </div>

      <!-- Book Button -->
      <div class="form-group book-button">
        <button @click="bookRoom">Book Now</button>
      </div>
    </div>

    <!-- Last 5 Bookings -->
    <div class="last-bookings">
      <h2>Last 5 Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Room</th>
            <th>User</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in lastBookings" :key="booking.id">
            <td>{{ getRoomName(booking.roomId) }}</td>
            <td>{{ booking.user }}</td>
            <td>{{ formatDateTime(booking.start) }}</td>
            <td>{{ formatDateTime(booking.end) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";

// Rooms
const rooms = reactive([
  { id: 1, name: "Room 101", capacity: 4 },
  { id: 2, name: "Room 102", capacity: 6 },
  { id: 3, name: "Room 103", capacity: 8 },
]);

// Time slots
const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Form state
let selectedRoom = "";
let fullName = "";
let startDate = "";
let startTime = "";
let endDate = "";
let endTime = "";

// Load bookings
const bookings = reactive(JSON.parse(localStorage.getItem("bookings") || "[]"));
const lastBookings = computed(() => bookings.slice(-5).reverse());

function getRoomName(roomId: number) {
  const room = rooms.find((r) => r.id === roomId);
  return room ? room.name : "Unknown";
}

// Format date time dd-mm-yyyy HH:mm
function formatDateTime(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
}

// Booking function
function bookRoom() {
  if (
    !selectedRoom ||
    !fullName ||
    !startDate ||
    !startTime ||
    !endDate ||
    !endTime
  ) {
    alert("Please fill in all fields");
    return;
  }

  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);

  if (start >= end) {
    alert("End time must be after start time");
    return;
  }

  bookings.push({
    id: Date.now(),
    roomId: Number(selectedRoom),
    user: fullName,
    start: start.toISOString(),
    end: end.toISOString(),
  });
  localStorage.setItem("bookings", JSON.stringify(bookings));

  alert("Booked successfully!");

  // Reset
  selectedRoom = "";
  fullName = "";
  startDate = "";
  startTime = "";
  endDate = "";
  endTime = "";
}
</script>

<style scoped>
.booking-room {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9fafb;
  color: #111827;
  min-height: 100vh;
  box-sizing: border-box;
}

h1 {
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 2em;
}

/* Top bar form */
.top-bar-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  align-items: flex-end; /* align button with inputs */
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 5px;
}

/* uniform height for input/select/button */
.form-group input,
.form-group select,
.form-group button {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 1em;
  height: 42px;
  box-sizing: border-box;
}

/* Special for button to keep same height and align bottom */
.form-group.book-button {
  margin-top: 24px; /* align with input fields */
}

.form-group button {
  background-color: #4b5563;
  color: white;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.form-group button:hover {
  background-color: #374151;
}

/* Last bookings table */
.last-bookings {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.last-bookings table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.last-bookings th,
.last-bookings td {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.last-bookings th {
  color: #6b7280;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .top-bar-form {
    flex-direction: column;
    align-items: stretch;
  }

  .form-group.book-button {
    margin-top: 0;
  }
}
</style>
