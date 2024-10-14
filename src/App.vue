<script setup>
import BHeader from './components/BHeader.vue'
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const showHeader = computed(() => {
  console.log("router1", router.currentRoute)
  console.log("router2", router.currentRoute.value.name)
  return router.currentRoute.value.name !== 'CountBookAPI'
})
</script>

<template>
  <div id="app">
    <router-view />
  </div>
  <div>
    <header v-if="showHeader">
      <BHeader />
    </header>
  </div>
  <div class="main-container">
    <header>
      <BHeader />
    </header>

    <main class="main-box">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped></style>
