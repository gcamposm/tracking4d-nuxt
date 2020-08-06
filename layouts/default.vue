<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" permanent fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router>
          <v-list-item-action>
            <v-icon v-html="item.icon" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-btn @click.stop="miniVariant = !miniVariant" icon>
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'" />
      </v-btn>
      <v-toolbar-title v-html="title" />
      <!-- <div v-if="$auth.loggedIn">
        {{ $auth.user.email }}
        <v-btn text>Cerrar sesión</v-btn>
      </div>
      <div v-else>
        <v-btn text to="/login>">Login</v-btn>
        <v-btn text to="/register>">Registrarse</v-btn>
      </div> -->
    </v-app-bar>
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
    <v-footer :fixed="fixed" app>
      <v-flex class="text-xs-right">
        <a href="http://spaceweare.com/" style="color: white">
          <span>SPACEWEARE - &copy; 2020</span>
        </a>
        &nbsp;
      </v-flex>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      nightMode: true,
      image: require('@/assets/img/background.jpg'),
      sidebarBackgroundColor: 'rgba(27, 27, 27, 0.74)',
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'bar_chart', title: 'Dashboard', to: '/dashboard' },
        { icon: 'people', title: 'Clientes', to: '/users' },
        { icon: 'map', title: 'Mapa de Calor', to: '/map' },
        { icon: 'menu_book', title: 'Reportes', to: '/reports' },
        { icon: 'camera_front', title: 'Cámara 1', to: '/recognize' },
        { icon: 'camera_front', title: 'Cámara 2', to: '/recognize2' },
        { icon: 'local_fire_department', title: 'Detección Temperatura', to: '/feature' },
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
    }
  },
  created () {
    this.$vuetify.theme.dark = this.nightMode
  },
  async mounted () {
    const self = this
    await self.$store.dispatch('face/load')
  }
}
</script>
