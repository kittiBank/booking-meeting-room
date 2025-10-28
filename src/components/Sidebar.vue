<template>
  <div class="sidebar">
    <h2 class="logo">Meeting Room</h2>

    <nav>
      <ul>
        <li>
          <router-link to="/" class="menu-item" active-class="active"
            >🏠 Dashboard</router-link
          >
        </li>
        <li>
          <router-link to="/booking" class="menu-item" active-class="active"
            >📅 Booking Room</router-link
          >
        </li>
        <li>
          <router-link
            to="/manage-bookings"
            class="menu-item"
            active-class="active"
            >🧾 Manage Bookings</router-link
          >
        </li>
        <li>
          <router-link
            to="/manage-rooms"
            class="menu-item"
            active-class="active"
            >🏢 Manage Rooms</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.sidebar {
  width: 230px;
  height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  padding: 20px 10px;
  box-sizing: border-box;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: left;
  padding-left: 10px;
  color: #333;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: block;
  padding: 12px 14px;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background-color 0.2s, color 0.2s;
  text-align: left;
}

/* hover effect */
.menu-item:hover {
  background-color: #e6f0ff;
  color: #007bff;
}

/* active route effect */
.active {
  background-color: #007bff;
  color: white;
  font-weight: 500;
}
</style>
