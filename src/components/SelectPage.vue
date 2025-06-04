<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useLevelStore, usePuzzlesStore } from '../stores/level.ts';
  import { onMounted } from 'vue';

  const levelStore = useLevelStore();
  const router = useRouter();
  const gotogame = (difficulty:string) => {
    levelStore.setLevel(difficulty);
    router.push('/game');
  };
  
  const puzzlesStore = usePuzzlesStore(); 
  onMounted(async () => {
      try {
          const res = await fetch('http://localhost:3000/api/puzzles')
          puzzlesStore.puzzles = await res.json()
      } catch (error) {
          console.error('Failed to fetch puzzles:', error)
      }
  })
</script>

<template>
  <div>
  <h1>
    難易度を選択
  </h1>
  <button class="button" @click="gotogame('easy')">easy</button>
  <button class="button" @click="gotogame('normal')">normal</button>
  <button class="button" @click="gotogame('hard')">hard</button>
  </div>
</template>

<style scoped>
  h1{
    margin: 30px auto;
    text-align: center;
  }

  .button{
    display: block;
    margin: 50px auto;
    font-size: 200%;
    width: 150px;
    padding: 0;
    justify-content: center; 
  }

  #app{
    display: flex;
    justify-content: center;
  }


</style>