<script setup lang="ts">
</script>

<template>
  <router-view :key="$route.fullPath" />
</template>

<style>
  html,body,#app{
    height: 100%;
    width: 100%;
    margin: 0;
  }
</style>