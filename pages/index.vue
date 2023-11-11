<script setup lang="ts">
import { toString } from 'lodash-es'
import logo from '../assets/logo.png'
import { defineState } from 'vue-define-state'

useSeoMeta({
  title: 'KI-VesD Interview Project',
  ogTitle: 'KI-VesD Interview Project',
  description: "Submission for Evan's technical interview with the KI-VesD team.",
  ogDescription: "Submission for Evan's technical interview with the KI-VesD team.",
  ogImage: 'https://kivesd-interview.pages.dev/banner.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})

const state = defineState({
  employeesData: null as Employee[] | null,
  password: '',
  loginError: '',
  loading: false
})

async function login() {
  state.loading = true
  state.loginError = ''
  try {
    state.employeesData = await api.login(state.password)
  } catch (err: unknown) {
    state.loginError = err instanceof Error ? err.message : toString(err)
  } finally {
    state.loading = false
  }
}

watch(() => state.password, () => {
  state.loginError = ''
})

if (process.dev) {
  state.password = 'KiVesd'
  login()
}
</script>

<template>
  <main class="container pt-4">
    <EmployeesDataTable v-if="state.employeesData" :employeesData="state.employeesData" />
    <form v-else method="POST" @submit.prevent="login">
      <div class="form-header">
        <img :src="logo" />
      </div>

      <h1>Sign in to KI-VesD</h1>
      <fieldset class="form-group">
        <label for="password">Password</label>
        <input v-model="state.password" name="password" id="password" type="password"
          :class="{ 'form-control': true, 'is-invalid': !!state.loginError }" placeholder="Password" required />

        <div v-if="state.loginError" class="invalid-feedback">
          {{ state.loginError }}
        </div>
      </fieldset>

      <button class="btn btn-primary mt-3" type="submit" :disabled="state.loading">
        <div class="spinner-border spinner-border-sm" role="status" v-if="state.loading">
          <span class="visually-hidden">Loading...</span>
        </div>
        Sign in
      </button>
    </form>

  </main>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

form {
  min-height: 40vh;
}

h1 {
  margin-top: 1rem;
}

img {
  width: 85px;
  height: 85px;
  display: block;
  margin: auto;
}
</style>