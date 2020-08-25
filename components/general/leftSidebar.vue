<template>
  <v-navigation-drawer
  id="app-drawer"
  app
  dark
  fixed
  floating
  persistent
  mobile-breakpoint="991"
  width="300"
  :mini-variant="miniVariant"
  :clipped="clipped"
  v-model="drawer"
  >
    <v-layout
      class="fill-height"
      column
    >
      <v-list>
        <v-list-item>
          <v-avatar size="35" color="indigo" class="mb-2">
            <v-icon size="x-large" dark>account_circle</v-icon>
          </v-avatar>
          <v-list-item-title class="ml-3 title" v-if="isEmpty(user)">
            {{ user.username }}
          </v-list-item-title>
        </v-list-item>
        <v-divider/>
        <v-list-item
          v-if="responsive"
        >
        </v-list-item>
        <v-list-item
          v-for="(item, i) in sidebarItems"
          :key="i"
          :to="item.to"
          :active-class="color"
          class="v-list-item"
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-title
            v-text="item.title"
          />
        </v-list-item>
      </v-list>
      <v-spacer></v-spacer>
      <v-list>
        <v-list-item
          :active-class="color"
          class="v-list-item"
          exact
        >
          <v-list-item-action>
            <v-icon @click="nightMode = !nightMode" v-if="!nightMode">far fa-moon</v-icon>
            <v-icon @click="nightMode = !nightMode" v-if="nightMode">fas fa-moon</v-icon>
          </v-list-item-action>
          <v-list-item-title
            v-text="'Alternar modo nocturo'"
          />
          <v-switch
            v-model="nightMode"
            color="secondary"
          ></v-switch>
        </v-list-item>
        <v-list-item
          :active-class="color"
          class="v-list-item"
          exact
          to="/help"
        >
          <v-list-item-action>
            <v-icon>help</v-icon>
          </v-list-item-action>
          <v-list-item-title
            v-text="'Ayuda'"
          />
        </v-list-item>
        <v-list-item
          :active-class="color"
          class="v-list-item"
          exact
          @click="logout"
        >
          <v-list-item-action>
            <v-icon>fas fa-sign-out-alt</v-icon>
          </v-list-item-action>
          <v-list-item-title
            v-text="'Salir'"
          />
        </v-list-item>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
  name: 'leftSidebar',
  data () {
    return {
      color: 'secondary',
      // image: require('@/assets/images/sidebar.jpg'),
      responsive: false
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
    ...mapActions([
      'logout',
      'isEmpty'
    ]),
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    nightMode: {
      get () { return this.$store.state.nightMode },
      set (payload) { this.$store.commit('updateNightMode', payload) }
    },
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
    sidebarItems: {
      get () { return this.$store.state.sidebarItems },
      set (payload) { this.$store.commit('updateSidebarItems', payload) }
    }
  }
}
</script>

<style>
  #app-drawer a{
    color: white;
  }
  #app-drawer a:hover{
    color: black !important;
  }
  #app-drawer .v-list__tile {
    border-radius: 4px;
  }
  #app-drawer .v-list__tile--buy {
    margin-top: auto;
    margin-bottom: 17px;
  }
  #app-drawer .v-image__image--contain {
    top: 9px;
    height: 60%;
  }
  #app-drawer .search-input {
    margin-bottom: 30px !important;
    padding-left: 15px;
    padding-right: 15px;
  }
  #app-drawer div.v-responsive.v-image > div.v-responsive__content {
    overflow-y: auto;
  }
  .title {
    text-transform: uppercase;
  }
</style>