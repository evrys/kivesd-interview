<script setup lang="ts">
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
</script>

<template>
  <main class="container pt-4">
    <h1>KI-VesD Interview Project</h1>
    Some stuff and things!
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td colspan="2">Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn-lg btn-primary">
      Click me!
    </button>
  </main>
</template>