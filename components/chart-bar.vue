<template>
  <div class="card">
    <div class="card-body">
      <h2 class="card-title">Grafico de barras - Visitas</h2>
      <br>
    </div>
                <v-row>
              <v-col cols="6">
                <v-menu
                  ref="firstMenu"
                  v-model="firstMenu"
                  :close-on-content-click="false"
                  :return-value.sync="InitialDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="InitialDate"
                      label="Fecha inicial"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker :max="today" v-model="InitialDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="firstMenu = false">Cancelar</v-btn>
                    <v-btn text color="primary" @click="$refs.firstMenu.save(InitialDate)">Aceptar</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-menu
                  ref="secondMenu"
                  v-model="secondMenu"
                  :close-on-content-click="false"
                  :return-value.sync="FinalDate"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="FinalDate"
                      label="Fecha final"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker :max="today" v-model="FinalDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="secondMenu = false">Cancelar</v-btn>
                    <v-btn text color="primary" @click="$refs.secondMenu.save(FinalDate)">Aceptar</v-btn>
                  </v-date-picker>
                </v-menu>
                <center>
                  <v-btn @click="getStatisticsDays()" color="primary">
                    Obtener Estadísticas
                  </v-btn>
                </center>
              </v-col>
            </v-row>
    
    <div class="card-img-bottom">
      <canvas id="fooCanvas" count="2" />

      <chartjs-bar
        v-for="(item, index) in types"
        :key="index"
        :backgroundcolor="item.bgColor"
        :beginzero="beginZero"
        :bind="true"
        :bordercolor="item.borderColor"
        :data="item.data"
        :datalabel="item.dataLabel"
        :labels="labels"
        target="fooCanvas"
      />
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      hours: [],
      persons: [],
      today: '',
      firstMenu: false,
      secondMenu: false,
      beginZero: true,
      labels: ['Lunes','Martes','Miércoles','Jueves', 'Viernes', 'Sábado', 'Domingo'],
      types: [
        {
          bgColor: "#f36e60",
          borderColor: "0c0306",
          data: [6, 7, 8, 9, 1, 3, 2],
          dataLabel: "Visitas registradas"
        },
        {
          bgColor: "#185190",
          borderColor: "030c0c",
          data: [1, 5, 2, 6, 3, 7, 4],
          dataLabel: "Visitas NN"
        }
      ]
    }
  },
  async created () {
    this.today = moment().format('YYYY-MM-DD')
    this.InitialDate = moment().subtract(1, 'month').format('YYYY-MM-DD')
    this.FinalDate = this.today
  },
  methods: {
    async getStatisticsDays () {
      let formData = new FormData()
      formData.append('firstDate', moment(this.InitialDate).format('YYYY-MM-DD HH:mm'))
      formData.append('secondDate', moment(this.FinalDate).format('YYYY-MM-DD HH:mm'))
      await axios
        .get(`${this.serverURL}/matches/getVisitsBetweenDates`, formData)
        .then(async (response) => {
          const result = response.data
          if (result.length !== 0) {
          }
        })
        .catch(e => {
          console.log('getStatisticsDays', e, e.response)
        })
    },
    async contacts (){
      let formData = new FormData()
      formData.append('day', moment(this.InitialDate).format('YYYY-MM-DD HH:mm'))
      await axios
        .post(`${this.serverURL}/persons/contactsBetweenPersons`, formData)
        .then(async (response) => {
          const result = response.data
        })
        .catch(e => {
          console.log('getStatisticsDays', e, e.response)
        })
    }
  },
  computed: {
    ...mapState([
    ]),
    serverURL () {
      return this.$store.state.general.serverURL
    }
  }
};
</script>