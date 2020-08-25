<template>
  <v-app-bar
    id="core-toolbar"
    app
    flat
    dark
    fixed
    elevate-on-scroll
    :clipped-left="clipped"
    >
    <v-app-bar-nav-icon
      @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
    <v-btn
      icon
      @click.stop="miniVariant = !miniVariant"
    >
      <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
    </v-btn>
<!--     <v-btn
      icon
      @click.stop="clipped = !clipped"
    >
      <v-icon>web</v-icon>
    </v-btn> -->
    <v-btn
      icon
      @click="goToAlert()"
    >
    <v-badge color="red" content="2"> 
      <v-icon>warning</v-icon>
    </v-badge> 
    </v-btn>
    <v-toolbar-title v-text="title"></v-toolbar-title>
  </v-app-bar>
</template>

<script>

import router from '@/router'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'toolbar',
  data () {
    return {
      responsive: false,
      responsiveInput: false
    }
  },
  computed: {
    miniVariant: {
      get () { return this.$store.state.miniVariant },
      set (payload) { this.$store.commit('updateMiniVariant', payload) }
    },
    clipped: {
      get () { return this.$store.state.clipped },
      set (payload) { this.$store.commit('updateClipped', payload) }
    },
    drawer: {
      get () { return this.$store.state.drawer },
      set (payload) { this.$store.commit('updateDrawer', payload) }
    },
    title: {
      get () { return this.$store.state.title },
      set (payload) { this.$store.commit('updateTitle', payload) }
    },
    fixed: {
      get () { return this.$store.state.fixed },
      set (payload) { this.$store.commit('updateFixed', payload) }
    },
    createSale: {
      get: function () { return this.$store.state.createSale },
      set: function (value) { this.$store.commit('updateCreateSale', value) }
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    goToAlert () {
      router.push({ name: 'temperature-alert' })
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
        this.responsiveInput = false
      } else {
        this.responsive = false
        this.responsiveInput = true
      }
    }
  }
}
</script>

<style>
  #core-toolbar a {
    text-decoration: none;
  }
  .searcher {
    margin-top: 1% !important;
  }
  .toolbar-item {
    padding: 2% !important;
  }
  .icon {
    margin-right: 5% !important;
  }
  .maxAlert {

  }
</style>