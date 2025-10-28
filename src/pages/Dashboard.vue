<template>
  <div class="dashboard">
    <!-- Top Cards -->
    <div class="cards">
      <div class="card">
        <h3>All Rooms</h3>
        <p>{{ stats.allRooms }}</p>
      </div>
      <div class="card">
        <h3>Booking Rooms</h3>
        <p>{{ stats.bookingRooms }}</p>
      </div>
      <div class="card">
        <h3>Empty Rooms</h3>
        <p>{{ stats.emptyRooms }}</p>
      </div>
      <div class="card">
        <h3>Occupied Rooms</h3>
        <p>{{ stats.occupiedRooms }}</p>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="bottom-section">
      <!-- Bar Chart Mock -->
      <div class="chart">
        <h3>Bookings This Week</h3>
        <div class="bar-chart-mock">
          <div
            class="bar"
            v-for="(count, index) in bookingsPerDay"
            :key="index"
            :style="{ height: count * 20 + 'px' }"
          >
            <span>{{ count }}</span>
          </div>
        </div>
      </div>

      <!-- Last 5 Bookings -->
      <div class="last-bookings">
        <h3>Last 5 Bookings</h3>
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>User</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(booking, index) in lastBookings" :key="index">
              <td>{{ booking.room }}</td>
              <td>{{ booking.user }}</td>
              <td>{{ booking.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

// Mock stats
const stats = reactive({
  allRooms: 10,
  bookingRooms: 6,
  emptyRooms: 4,
  occupiedRooms: 6,
});

// Mock bottom section
const bookingsPerDay = reactive([2, 3, 5, 1, 4, 0, 0]);
const lastBookings = reactive([
  { room: "Room 101", user: "Alice", time: "09:00 - 10:00" },
  { room: "Room 102", user: "Bob", time: "10:00 - 11:00" },
  { room: "Room 103", user: "Charlie", time: "11:00 - 12:00" },
  { room: "Room 104", user: "David", time: "13:00 - 14:00" },
  { room: "Room 105", user: "Eve", time: "14:00 - 15:00" },
]);
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 100vh;
  padding: 20px;
  background-color: #f9fafb;
  color: #111827;
  box-sizing: border-box;
}

/* Top Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}
.card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
.card h3 {
  margin-bottom: 10px;
  font-weight: 600;
  color: #374151;
}
.card p {
  font-size: 1.5em;
  font-weight: bold;
  color: #1f2937;
}

/* Bottom Section */
.bottom-section {
  display: flex;
  gap: 20px;
  flex: 1;
  flex-wrap: wrap;
}

/* Chart Mock */
.chart {
  flex: 1;
  min-width: 300px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
.bar-chart-mock {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 200px;
  margin-top: 20px;
}
.bar-chart-mock .bar {
  width: 30px;
  background-color: #9ca3af;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  position: relative;
}
.bar-chart-mock .bar span {
  font-size: 0.8em;
  color: #111827;
  margin-bottom: 4px;
}
.bar-chart-mock .bar:hover {
  background-color: #6b7280;
}

/* Last 5 bookings */
.last-bookings {
  flex: 1;
  min-width: 300px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
.last-bookings table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  color: #111827;
}
.last-bookings th,
.last-bookings td {
  padding: 8px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}
.last-bookings th {
  color: #6b7280;
  font-weight: 500;
}
</style>
