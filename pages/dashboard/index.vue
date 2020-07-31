<template>
  <div id="dashboard-index">
    <dashboard-show/>
  </div>
</template>

<script>

import Dashboard from '@/components/dashboard/show.vue'

export default {
  name: 'dashboard-index',
  components: {
    'dashboard-show': Dashboard
  }
}
</script>

<style>

</style>
