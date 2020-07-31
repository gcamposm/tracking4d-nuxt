<template>
  <div id="feature" class="mt-5">
    <v-container>
      <v-card
        :dark="nightMode"
      >
        <v-img
        :src="image"
        height="660"
        >
          <v-layout align-center justify-center column fill-height>
            <h1 class="display-2 font-weight-heavy mb-4">¡PRÓXIMAMENTE!</h1>
            <h4 class="subheading font-weight-heavy">ESTAMOS TRABAJANDO DURO PARA TRAER NUEVAS ACTUALIZACIONES</h4>
          </v-layout>
        </v-img>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'feature',
  data () {
    return {
      image: require('@/assets/img/futureFeature.jpg')
    }
  },
  computed: {
    ...mapState([
    ])
  }
}
</script>

<style>
  .font-weight-heavy {
    color: white !important;
  }
</style>
