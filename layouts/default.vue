<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon
      @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-btn v-if="numberAlerts > 0"
      icon
      @click="goToAlert()"
    >
    <v-badge color="red" :content="numberAlerts"> 
      <v-icon>warning</v-icon>
    </v-badge> 
    </v-btn>
    </v-app-bar>
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
          <v-list-item-title class="ml-3 title">
            ADMINTRACKING4D
          </v-list-item-title>
        </v-list-item>
        <v-divider/>


        <v-list-item href="https://tracking4dd.tk/dashboard">
          <v-list-item-action>
            <v-icon>_insert_chart</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="https://tracking4dd.tk/person">
          <v-list-item-action>
            <v-icon>_supervisor_account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Personas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="https://tracking4dd.tk/report">
          <v-list-item-action>
            <v-icon>_library_books</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Reportes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="https://tracking4dd.tk/heat-map">
          <v-list-item-action>
            <v-icon>_room</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mapa de Calor</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="https://tracking4dd.tk/facial-recognition">
          <v-list-item-action>
            <v-icon>_videocam</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Cámara</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="https://tracking4dd.tk/temperature-detection">
          <v-list-item-action>
            <v-icon>_whatshot</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Detección de temperatura</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="https://tracking4dd.tk/temperature-alert">
          <v-list-item-action>
            <v-icon>_report_problem</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Alertas de temperatura</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
      <v-spacer></v-spacer>
      <v-list>
        <!-- <v-list-item
          :active-class="color"
          class="v-list-item"
          exact
        >
          <v-list-item-action>
            <v-icon @click="nightMode = !nightMode" v-if="!nightMode">brightness_3</v-icon>
            <v-icon @click="nightMode = !nightMode" v-if="nightMode">brightness_3</v-icon>
          </v-list-item-action>
          <v-list-item-title
            v-text="'Alternar modo nocturo'"
          />
          <v-switch
            v-model="nightMode"
            color="secondary"
          ></v-switch>
        </v-list-item> -->
        <v-list-item
          :active-class="color"
          class="v-list-item"
          exact
          to="/help"
        >
          <v-list-item-action>
            <v-icon>_help</v-icon>
          </v-list-item-action>
          <v-list-item-title
            v-text="'Ayuda'"
          />
        </v-list-item>
        <v-list-item
          :active-class="color"
          class="v-list-item"
          exact
        >
          <v-list-item-action>
            <v-icon>_exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-title
            v-text="'Salir'"
          />
        </v-list-item>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
    <v-content>
      <v-img
        :src="image"
        gradient="to top right, rgb(5, 5, 251, .1),rgba(240, 189, 36, .35)"
        height="100%"
      >
      <v-container fluid>
        <nuxt />
        <!-- <v-spacer></v-spacer>
        <v-list-item
          :active-class="color"
          class="v-list-item"
          exact
        >
          <v-list-item-action>
            
            <v-icon @click="nightMode = !nightMode" v-if="!nightMode">far fa-moon</v-icon>
            <v-icon @click="nightMode = !nightMode" v-if="nightMode">fas fa-moon</v-icon>
          </v-list-item-action>
          <v-list-item-title v-text="'Modo nocturo'"/>
          <v-switch v-model="nightMode" color="blue"/>
        </v-list-item> -->
      </v-container>
      </v-img>
    </v-content>
    <v-footer dark :fixed="fixed" app>
    <span class="ml-3">Desarrollado por SPACEWEARE&copy; {{ new Date().getFullYear() }}</span>
    <v-spacer></v-spacer>
      <span>Versión 1.1.0</span>
        <v-spacer></v-spacer>
      <span>Bienvenido al futuro!</span>
  </v-footer>
  </v-app>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      color: 'secondary',
      numberAlerts: 0,
      alerts: [],
      nightMode: true,
      image: require('@/assets/img/background.jpg'),
      color: 'secondary',
      responsive: false,
      sidebarBackgroundColor: 'rgba(27, 27, 27, 0.74)',
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'fas fa-chart-line', title: 'Dashboard', to: 'www.google.cl' },
        { icon: 'fas fa-users', title: 'Personas', to: '/person' },
        { icon: 'fas fa-book-open', title: 'Reportes', to: '/report' },
        { icon: 'fas fa-map', title: 'Mapa de calor', to: '/heat-map' },
        { icon: 'fas fa-eye', title: 'Cámara', to: '/facial-recognition' },
        { icon: 'fas fa-thermometer', title: 'Detección de temperatura', to: '/temperature-detection' },
        { icon: 'fas fa-exclamation-triangle', title: 'Alertas de temperatura', to: '/temperature-alert' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Tracking4D - SPACEWEARE &reg'
    }
  },
  computed: {
    loading () {
      return this.$store.state.face.loading
    },
    ...mapState([
    ]),
    serverURL () {
      return this.$store.state.general.serverURL
    },
    miniVariant: {
      get () { return this.$store.state.general.miniVariant },
      set (payload) { this.$store.commit('updateMiniVariant', payload) }
    },
  },
  created () {
    this.$vuetify.theme.dark = this.nightMode
    this.getAlerts()
  },
  async mounted () {
    const self = this
    await self.$store.dispatch('face/load')
  },
  methods: {
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
    async getAlerts() {
      await axios
        .get(`${this.serverURL}/matches/alerts/`)
        .then(response => {
          const alerts = response.data
          if (alerts.length !== 0) {
            this.alerts = alerts
            this.numberAlerts = alerts.length
            console.log('Alert list loaded')
          } else {
            this.alerts = []
            this.numberAlerts = 0
            console.log('There is not alerts');
          }
        })
    },
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
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