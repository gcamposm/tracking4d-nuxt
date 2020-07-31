<template>
  <div id="dashboard-show">
    <v-container fill-height fluid grid-list-xl>
      <v-layout justify-center wrap>
        <v-flex md12>
            <v-flex xs10 offset-xs1 slot="header">
              <v-tabs color="white" background-color="transparent" slider-color="white">
                <span class="subheading">
                  <v-icon>assignment</v-icon>DASHBOARD
                </span>
                <v-spacer></v-spacer>
                <center></center>
              </v-tabs>
            </v-flex>
            <v-flex md12 lg12>
              <line-chart
                :options="chartOptions"
                :chartColors="positiveChartColor"
                label="Visitas totales"
              ></line-chart>
              <bar-chart
                :options="chartOptions"
                label="Visitas totales"
              ></bar-chart>
            </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import LineChart from '@/components/dashboard/LineChart.vue'
import BarChart from '@/components/dashboard/BarChart.vue'

export default {
  name: 'dashboard-show',
  components: {
    LineChart: LineChart,
    BarChart: BarChart
  },
  data () {
    return {
      arrPositive: [],
      positiveChartColor: {
        borderColor: '#077187',
        pointBorderColor: '#0E1428',
        pointBackgroundColor: '#AFD6AC',
        backgroundColor: '#74A57F'
      },
      NNChartColor: {
        borderColor: '#1030cf',
        pointBorderColor: '#38b6e6',
        pointBackgroundColor: '#38b6e6',
        backgroundColor: '#38b6e6'
      },
      matchChartColor: {
        borderColor: '#e63838',
        pointBorderColor: '#0E1428',
        pointBackgroundColor: '#AFD6AC',
        backgroundColor: '#e63838'
      },
      arrHopitalized: [],
      arrInIcu: [],
      arrOnVentilators: [],
      arrRecovered: [],
      arrDeaths: [],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      regularRules: [(v) => !!v || 'Este campo es obligatorio']
    }
  },
  async created () {
  },
  methods: {
    ...mapActions([])
  },
  computed: {
    ...mapState([])
  }
}
</script>

<style>
.subheading {
  align-self: center;
  font-weight: 501;
}
td {
  text-align: center !important;
}
</style>
