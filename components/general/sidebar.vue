<template>
  <v-navigation-drawer
    temporary
    :right="right"
    v-model="rightDrawer"
    fixed
  >
    <v-list>
      <v-list-item @click.native="right = !right">
        <v-list-item-action>
          <v-icon light>compare_arrows</v-icon>
        </v-list-item-action>
        <v-list-item-title>Switch drawer (click me)</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'sidebar',
  computed: {
    rightDrawer: {
      get () {
        return this.$store.state.rightDrawer
      },
      set (payload) {
        this.$store.commit('updateRightDrawer', payload)
      }
    },
    right: {
      get () {
        return this.$store.state.right
      },
      set (payload) {
        this.$store.commit('updateRight', payload)
      }
    }
  }
}
</script>