
<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const props = defineProps<{
  modelValue: any
  options: { value: any, text: string, disabled?: boolean }[]
}>()

const selectedValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})
</script>

<template>
  <select v-model="selectedValue" class="form-select">
    <option v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
      {{ opt.text }}
    </option>
  </select>
</template>

<style lang="sass" scoped>
</style>
