<template>
  <div class="container">
    <h1 class="title">Manage Bookings</h1>

    <!-- Filter / Search -->
    <div class="filter">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name or room"
        class="input"
      />
      <input
        v-model="filterDate"
        type="date"
        class="input"
      />
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
            <td>{{ booking.name }}</td>
            <td>{{ booking.room }}</td>
            <td>{{ booking.date }}</td>
            <td>{{ booking.time }}</td>
            <td>
              <span :class="['status', statusClass(booking.status)]">{{ booking.status }}</span>
            </td>
            <td>
              <button class="btn edit" @click="editBooking(booking)">Edit</button>
              <button class="btn cancel" @click="cancelBooking(booking)">Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const bookings = ref([
  { id: 1, name: "Alice", room: "Meeting A", date: "2025-10-30", time: "10:00 - 11:00", status: "Confirmed" },
  { id: 2, name: "Bob", room: "Meeting B", date: "2025-10-31", time: "13:00 - 14:00", status: "Pending" },
  { id: 3, name: "Charlie", room: "Meeting C", date: "2025-10-28", time: "09:00 - 10:00", status: "Cancelled" },
]);

const search = ref("");
const filterDate = ref("");

const filteredBookings = computed(() => {
  return bookings.value.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.value.toLowerCase()) 
                          || b.room.toLowerCase().includes(search.value.toLowerCase());
    const matchesDate = filterDate.value ? b.date === filterDate.value : true;
    return matchesSearch && matchesDate;
  });
});

const statusClass = (status) => {
  switch(status) {
    case "Confirmed": return "confirmed";
    case "Pending": return "pending";
    case "Cancelled": return "cancelled";
    default: return "";
  }
};

const editBooking = (booking) => {
  alert(`Edit booking ID ${booking.id}`);
};

const cancelBooking = (booking) => {
  alert(`Cancel booking ID ${booking.id}`);
};
</script>

<style>
.container {
  max-width: 1000px;
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

.filter {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.booking-table {
  width: 100%;
  border-collapse: collapse;
}

.booking-table th, .booking-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
}

.booking-table thead {
  background: #f0f0f0;
}

.booking-table tbody tr:hover {
  background: #f5f5f5;
}

.status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status.confirmed { background: #e0f7e9; color: #2d9a4b; }
.status.pending { background: #fff4e5; color: #d27f00; }
.status.cancelled { background: #fdecea; color: #d93025; }

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
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

/* Responsive */
@media (max-width: 768px) {
  .filter {
    flex-direction: column;
  }
}
</style>
