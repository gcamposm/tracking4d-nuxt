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
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <v-progress-circular
          v-if="loading"
          :size="200"
          :width="20"
          color="red"
          indeterminate
        >
          Loading 7MB models.
          <br>
          Please be patient...
        </v-progress-circular>
        <nuxt />
      </v-container>
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
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'bar_chart', title: 'Dashboard', to: '/' },
        { icon: 'people', title: 'Clientes', to: '/users' },
        { icon: 'business', title: 'Empresas', to: '/' },
        { icon: 'flip_camera_android', title: 'Entrenamiento', to: '/train' },
        { icon: 'menu_book', title: 'Reportes', to: '/' },
        { icon: 'camera_front', title: 'Reconocimiento Facial', to: '/recognize' },
        { icon: 'local_fire_department', title: 'Detección Temperatura', to: '/' },
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
    this.$vuetify.theme.dark = true
  },
  async mounted () {
    const self = this
    await self.$store.dispatch('face/load')
  }
}
</script>
