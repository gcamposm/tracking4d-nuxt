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
    <h2 class="toolbarTitle"> Usuario:  - Nombre lugar</h2>
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

        <v-list-item href="http://localhost:8080/dashboard">
          <v-list-item-action>
            <v-icon>_insert_chart</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="http://localhost:8080/person">
          <v-list-item-action>
            <v-icon>_supervisor_account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Personas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="http://localhost:8080/report">
          <v-list-item-action>
            <v-icon>_library_books</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Reportes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="http://localhost:8080/heat-map">
          <v-list-item-action>
            <v-icon>_room</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mapa de Calor</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="http://localhost:3000/recognize2">
          <v-list-item-action>
            <v-icon>_videocam</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Cámara Tracking</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="http://localhost:3000/recognize">
          <v-list-item-action>
            <v-icon>_videocam</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Cámara COVID</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="http://localhost:8080/temperature-detection">
          <v-list-item-action>
            <v-icon>_whatshot</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Detección de temperatura</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="http://localhost:8080/temperature-alert">
          <v-list-item-action>
            <v-icon>_report_problem</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Alertas de temperatura</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="http://localhost:8080/unknown">
          <v-list-item-action>
            <v-icon>_help</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Desconocidos</v-list-item-title>
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
       <!--  <v-list-item
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
        </v-list-item> -->
        <v-list-item
          :active-class="color"
          class="v-list-item"
          exact
          href="http://localhost:8080/logout"
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
    }
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
  }
}
</script>

<style>
.toolbarTitle{
    margin-left: 10%;
  }

</style>