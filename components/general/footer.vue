<template>
  <v-footer dark :fixed="fixed" app>
    <span class="ml-3">Desarrollado por SPACEWEARE&copy; {{ new Date().getFullYear() }}</span>
    <v-spacer></v-spacer>
    <span>Versión 1.1.0</span>
    <v-spacer></v-spacer>
    <span>Bienvenido al futuro!</span>
  </v-footer>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'home-footer',
  computed: {
    fixed: {
      get () { return this.$store.state.fixed },
      set (payload) { this.$store.commit('updateMiniFixed', payload) }
    }
  }
}
</script>