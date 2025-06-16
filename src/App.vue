<script setup lang="ts">
import { onMounted } from 'vue';
import { usePuzzlesStore } from './stores/level.ts';
import { login, fetchPuzzles } from './api';

onMounted(async () => {
  try {
    await login('0000', 'password');
    usePuzzlesStore().puzzles = await fetchPuzzles();
  } catch (error) {
    console.error('初期処理でエラー', error);
  }
});

</script>

<template>
  <router-view :key="$route.fullPath" />
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
}
</style>