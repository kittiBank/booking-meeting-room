import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import BookingRoom from '../pages/BookingRoom.vue'
import ManageBookings from '../pages/ManageBookings.vue'
import ManageRooms from '../pages/ManageRooms.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/booking', component: BookingRoom },
  { path: '/manage-bookings', component: ManageBookings },
  { path: '/manage-rooms', component: ManageRooms },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
