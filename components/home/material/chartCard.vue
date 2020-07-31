<template>
  <material-card
    v-bind="$attrs"
    class="v-card--material-chart"
    v-on="$listeners"
  >
    <chartist
      slot="header"
      :data="data"
      :event-handlers="eventHandlers"
      :options="options"
      :ratio="ratio"
      :responsive-options="responsiveOptions"
      :type="type"
    />

    <slot />

    <slot
      slot="actions"
      name="actions"
    />
  </material-card>
</template>

<script>

import MaterialCard from '@/components/home/material/card.vue'

export default {
  name: 'material-chart-card',
  components: {
    'material-card': MaterialCard
  },
  inheritAttrs: false,

  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    eventHandlers: {
      type: Array,
      default: () => ([])
    },
    options: {
      type: Object,
      default: () => ({})
    },
    ratio: {
      type: String,
      default: undefined
    },
    responsiveOptions: {
      type: Array,
      default: () => ([])
    },
    type: {
      type: String,
      required: true,
      validator: v => ['Bar', 'Line', 'Pie'].includes(v)
    }
  }
}
</script>

<style>
  .v-card--material-chart .v-card--material__header .ct-label {
    color: inherit;
    opacity: .7;
    font-size: 0.975rem;
    font-weight: 100;
  }
  .v-card--material-chart .v-card--material__header .ct-grid{
    stroke: rgba(255, 255, 255, 0.2);
  }
  .v-card--material-chart .v-card--material__header .ct-series-a .ct-point,
  .v-card--material-chart .v-card--material__header .ct-series-a .ct-line,
  .v-card--material-chart .v-card--material__header .ct-series-a .ct-bar,
  .v-card--material-chart .v-card--material__header .ct-series-a .ct-slice-donut {
      stroke: rgba(255,255,255,.8);
  }
  .v-card--material-chart .v-card--material__header .ct-series-a .ct-slice-pie,
  .v-card--material-chart .v-card--material__header .ct-series-a .ct-area {
      fill: rgba(255,255,255,.4);
  }
</style>
