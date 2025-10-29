<template>
  <div class="booking-room">
    <h1>Booking Room</h1>

    <div class="top-bar-form">
      <!-- Room -->
      <div class="form-group">
        <label>Room</label>
        <select v-model.number="selectedRoom">
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

      <!-- Start Date & Time -->
      <div class="form-group">
        <label>Start Date</label>
        <input type="date" v-model="startDate" />
      </div>
      <div class="form-group">
        <label>Start Time</label>
        <select v-model="startTime">
          <option v-for="slot in timeSlots" :key="slot" :value="slot">
            {{ slot }}
          </option>
        </select>
      </div>

      <!-- End Date & Time -->
      <div class="form-group">
        <label>End Date</label>
        <input type="date" v-model="endDate" />
      </div>
      <div class="form-group">
        <label>End Time</label>
        <select v-model="endTime">
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

    <!-- Last Bookings -->
    <div class="last-bookings">
      <h2>Last Bookings</h2>
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
            <td>{{ booking.room }}</td>
            <td>{{ booking.user }}</td>
            <td>
              {{ formatDateTime(booking.start_date, booking.start_time) }}
            </td>
            <td>{{ formatDateTime(booking.end_date, booking.end_time) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";

interface Room {
  id: number;
  name: string;
  capacity: number;
}

interface Booking {
  id: number;
  room: string;
  user: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  status?: string;
}

// Form state
const selectedRoom = ref<number | null>(null);
const fullName = ref("");
const startDate = ref("");
const startTime = ref("");
const endDate = ref("");
const endTime = ref("");

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

// Rooms & bookings
const rooms = ref<Room[]>([]);
const bookings = ref<Booking[]>([]);
const lastBookings = computed(() => bookings.value.slice(-5).reverse());

// Fetch rooms
async function fetchRooms() {
  try {
    const res = await axios.get<Room[]>("http://localhost:5001/api/rooms");
    rooms.value = res.data;
    if (rooms.value.length > 0 && selectedRoom.value === null) {
      selectedRoom.value = rooms.value[0].id; // default room
    }
  } catch (err) {
    console.error("Error fetching rooms:", err);
  }
}

// Fetch bookings
async function fetchBookings() {
  try {
    const res = await axios.get<Booking[]>(
      "http://localhost:5001/api/bookings"
    );
    bookings.value = res.data.map((b) => ({
      ...b,
      status: b.status || "Confirmed",
    }));
  } catch (err) {
    console.error("Error fetching bookings:", err);
  }
}

// Format date-time
function formatDateTime(dateStr: String, timeStr: String) {
  if (!dateStr || !timeStr) return "";
  const [y, m, d] = dateStr.split("-");
  const [h, min] = timeStr.split(":");
  return `${d}/${m}/${y} ${h}:${min}`;
}

// Combine date + time slot
function combineDateTime(date: string, time: string) {
  if (!date || !time) return null;

  const [y, m, d] = date.split("-").map(Number);
  const [h, min, s] = time.split(":").map(Number);

  // +7 timezone => บวก 7 ชั่วโมง
  // Node/Vue จะเข้าใจเป็น local time
  const dateObj = new Date(y, m - 1, d, h, min, s);

  return dateObj;
}

// Book room
async function bookRoom() {
  if (
    selectedRoom.value === null ||
    !fullName.value ||
    !startDate.value ||
    !startTime.value ||
    !endDate.value ||
    !endTime.value
  ) {
    console.log({
      selectedRoom: selectedRoom.value,
      fullName: fullName.value,
      startDate: startDate.value,
      startTime: startTime.value,
      endDate: endDate.value,
      endTime: endTime.value,
    });
    alert("All fields are required");
    return;
  }

  const startDateTime = combineDateTime(startDate.value, startTime.value);
  const endDateTime = combineDateTime(endDate.value, endTime.value);

  if (!startDateTime || !endDateTime) {
    alert("Invalid start or end date/time");
    return;
  }

  if (startDateTime >= endDateTime) {
    alert("End time must be after start time");
    return;
  }

  try {
    const res = await axios.post<Booking>(
      "http://localhost:5001/api/bookings",
      {
        room_id: selectedRoom.value,
        name: fullName.value,
        start_date: startDate.value,
        end_date: endDate.value,
        start_time: startTime.value,
        end_time: endTime.value,
      }
    );

    bookings.value.push({
      id: res.data.id,
      room:
        rooms.value.find((r) => r.id === selectedRoom.value)?.name || "Unknown",
      user: fullName.value,
      start_date: startDate.value,
      start_time: startTime.value,
      end_date: endDate.value,
      end_time: endTime.value,
      status: "Confirmed",
    });

    // Reset
    const today = new Date().toISOString().slice(0, 10);
    startDate.value = today;
    endDate.value = today;
    startTime.value = timeSlots[0];
    endTime.value = timeSlots[0];
    fullName.value = "";
    selectedRoom.value = rooms.value.length > 0 ? rooms.value[0].id : null;

    alert("Booked successfully!");
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to book room");
    console.error(err);
  }
}

// Initial load
onMounted(() => {
  fetchRooms();
  fetchBookings();
  const today = new Date().toISOString().slice(0, 10);
  startDate.value = today;
  endDate.value = today;
  startTime.value = timeSlots[0];
  endTime.value = timeSlots[0];
});
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
