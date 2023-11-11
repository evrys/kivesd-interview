<script setup lang="ts">
import type { EmployeeColumnDef } from '~/utils/employeeData'

const props = defineProps<{
  col: EmployeeColumnDef
}>()
</script>

<template>
  <!-- <div class="card"> -->
  <form @submit.prevent>
    <div class="form-check">
      <input class="form-check-input" type="checkbox" :id="`toggle-${col.key}`" v-model="col.displayed">
      <label class="form-check-label" :for="`toggle-${col.key}`">
        {{ col.label }}
      </label>
    </div>
    <div class="form-group">
      <label :for="`padding-${col.key}`" class="form-label">Padding</label>
      <input type="range" class="form-range" :id="`padding-${col.key}`" min="0" max="30" v-model="col.padding">
    </div>

  </form>
  <!-- </div> -->
</template>