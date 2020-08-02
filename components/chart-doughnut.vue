<template>
  <div class="card">
    <div class="card-body">
      <h2 class="card-title">Gráfica de anillo</h2>
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
            <br><br>




    <div class="card-img-bottom">
      <chartjs-doughnut
        :bind="true"
        :datasets="datasets"
        :labels="labels"
        :option="option"
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
      today: '',
      unknowns: 0,
      totals: 0,
      matches: 0,
      firstMenu: false,
      secondMenu: false,
      datasets: [
        {
          data: [this.totals, this.matches, this.unknowns],
          backgroundColor: ["#f36e60", "#ffdb3b", "#185190"],
          hoverBackgroundColor: ["#fbd2cd", "#fef5c9", "#d1e3f7"]
        }
      ],
      labels: ["Visitas totales", "Visitas registradas", "Visitas NN"],
      option: {}
    };
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
        .post(`${this.serverURL}/detections/getVisitsBetweenDates`, formData)
        .then(async (response) => {
          const result = response.data
          console.log(response);
          console.log(result)
          result.forEach(element => {
            this.unknowns = element.unknown+this.unknowns
            this.matches = element.matches+this.matches
            this.totals = element.total+this.totals
          });
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
        .post(`${this.serverURL}/customers/contactsBetweenCustomers`, formData)
        .then(async (response) => {
          const result = response.data
          console.log(result)
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
