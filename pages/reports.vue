<template>
  <v-container>
    <v-layout row wrap align-center>
      <v-flex xs12 md10 lg10>
        <v-card>
        <div id="chart-saleTotals">
          <v-container>
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
                  <v-date-picker :language="es" :max="today" v-model="InitialDate" no-title scrollable>
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
                  <v-date-picker :language="es" :max="today" v-model="FinalDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="secondMenu = false">Cancelar</v-btn>
                    <v-btn text color="primary" @click="$refs.secondMenu.save(FinalDate)">Aceptar</v-btn>
                  </v-date-picker>
                </v-menu>
                <center>
                  <v-btn @click="getStatisticsDays()" color="primary">
                    Obtener Estadísticas
                  </v-btn>
                  <v-btn @click="obtainExcel()" color="primary">
                    Obtener Excel
                  </v-btn>
                  <!-- <v-btn @click="contacts()" color="primary">
                    Obtener Contactos
                  </v-btn> -->
                </center>
              </v-col>
            </v-row>
               <template>
              <v-progress-linear color="warning" indeterminate></v-progress-linear>
            </template>
          </v-container>
        </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import axios from 'axios'
import moment from 'moment'
import { es } from 'vuejs-datepicker/dist/locale'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'chart-saleTotals',
  components: {
  },
  data () {
    return {
      es: es,
      /* General Stuffs */
      today: '',
      firstMenu: false,
      secondMenu: false,
      /* Chart  Stuffs */
    }
  },
  async created () {
    this.today = moment().format('YYYY-MM-DD')
    this.InitialDate = moment().subtract(1, 'month').format('YYYY-MM-DD')
    this.FinalDate = this.today
  },
  methods: {
    ...mapActions([
    ]),
    async getIncomeOutcome (){
      let formData = new FormData()
      formData.append('day', moment(this.InitialDate).format('YYYY-MM-DD HH:mm'))
      formData.append('customerId', 1)
      await axios
        .post(`${this.serverURL}/matches/getIncomeOutcome`, formData)
        .then(async (response) => {
          const result = response.data
          console.log(result)
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
    },
    async obtainExcel () {
      let formData = new FormData()
      formData.append('day', moment(this.InitialDate).format('YYYY-MM-DD HH:mm'))
      await axios
        .post(`${this.serverURL}/customers/write`, formData)
        .then(async (response) => {
          console.log("Write correct")
        })
        .catch(e => {
          console.log('getMostSoldProducts', e, e.response)
        })
        await axios({
        url: `${this.serverURL}/customers/download`,
        method: 'GET',
        responseType: 'blob' // important
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'Clientes - ' + moment().format('YYYY-MM-DD') + '.xlsx') // or any other extension
          document.body.appendChild(link)
          link.click()
        })
        .catch(e => {
          console.log('No se ha podido descargar el archivo: ', e, e.response)
        })
    },
    async getStatisticsDays () {
      let formData = new FormData()
      formData.append('firstDate', moment(this.InitialDate).format('YYYY-MM-DD HH:mm'))
      formData.append('secondDate', moment(this.FinalDate).format('YYYY-MM-DD HH:mm'))
      await axios
        .post(`${this.serverURL}/matches/getMatchesByDate`, formData)
        .then(async (response) => {
          const result = response.data
          console.log(response);
            console.log(result)
          if (result.length !== 0) {
          }
        })
        .catch(e => {
          console.log('getStatisticsDays', e, e.response)
        })
    },
  },
  computed: {
    ...mapState([
    ]),
    serverURL () {
      return this.$store.state.general.serverURL
    }
  }
}
</script>

<style scoped>

</style>
