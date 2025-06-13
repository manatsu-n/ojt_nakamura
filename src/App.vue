<script setup lang="ts">
import { onMounted } from 'vue';
import { usePuzzlesStore } from './stores/level.ts';
import { loginAndSetToken, fetchPuzzles } from './api';

const puzzlesStore = usePuzzlesStore();

onMounted(async () => {
  try {
    await loginAndSetToken('0000', 'password');
    const puzzles = await fetchPuzzles();
    puzzlesStore.puzzles = puzzles;
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