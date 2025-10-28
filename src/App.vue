<template>
  <div class="layout">
    <Sidebar />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<style scoped>
.layout {
  display: flex;
  height: 100%;
  margin: 0;
  padding: 0;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
}
</style>
