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
  <div class="form-check">
    <input class="form-check-input" type="checkbox" value="" id="sortDesc" v-model="state.sortDesc">
    <label class="form-check-label" for="sortDesc">
      Descending
    </label>
  </div>
</template>

<style lang="sass" scoped>
</style>
