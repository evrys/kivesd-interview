<script setup lang="ts">
defineProps<{
  employee: Employee
}>()
</script>

<template>
  <div>{{ employee.address }}</div>
  <div v-if="employee.region && employee.country">{{ employee.region }}, {{ employee.country }}</div>
  <div v-else-if="employee.region">{{ employee.region }}</div>
  <div v-else-if="employee.country">{{ employee.country }}</div>
</template>