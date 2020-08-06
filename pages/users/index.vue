<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm8 offset-sm2 align-center justify-center>
        <v-card class="elevation-12">
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="customerToUpload.firstName"
                  :rules="nameRules"
                  label="Nombres"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="customerToUpload.lastName"
                  :rules="lastNameRules"
                  label="Apellidos"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="customerToUpload.rut"
                  :rules="rutRules"
                  label="Rut"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="customerToUpload.activity"
                  :rules="activityRules"
                  label="Sección de trabajo o actividad"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="customerToUpload.mail"
                  label="Correo electrónico"
                  type="email"
                  :rules="mailRules"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="customerToUpload.phoneNumber"
                  :rules="phoneRules"
                  label="Celular"
                  type="number"
                  autocomplete="off"
                  required
                />
                <v-spacer />
                <v-btn
                  :disabled="!valid"
                  @click="register()"
                  color="primary"
                >
                  Registrar nuevo usuario
                </v-btn>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-dialog v-model="dialog" persistent max-width="320">
        <v-card>
          <v-card-title class="headline">
            Advertencia!
          </v-card-title>
          <v-card-text>¿Está seguro de eliminar este usuario?</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="hideDialog()" color="blue" text>
              Cancelar
            </v-btn>
            <v-btn @click="deleteUpload()" color="blue" text>
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-flex xs12 sm8 offset-sm2 align-center justify-center>
      <br><br><br><br>
        <v-card class="elevation-12">
          <h1><center>Clientes registrados</center></h1>
          <v-card-text>
            <v-container>
              <v-list two-line subheader>
                <v-list-item v-for="customer in customers" :key="customer.rut">
                  <v-list-item-avatar>
                    <v-avatar
                      slot="activator"
                      size="32px"
                    >
                      <img
                        v-if="customer.photos.length"
                        :src="customer.photos[0]"
                        alt="Avatar"
                      >
                      <v-icon
                        v-else
                        color="primary"
                      >
                        person
                      </v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      <h2> Nombre Cliente: {{ customer.firstName }} {{ customer.lastName }} </h2>
                      <v-divider />
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn @click="showDialog(customer.rut)" color="primary" fab small>
                      <v-icon>
                        close
                      </v-icon>
                    </v-btn>
                    <v-divider />
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn @click="toUploadPhotosView(customer.rut)" color="primary" fab small>
                      <v-icon>
                        add_a_photo
                      </v-icon>
                    </v-btn>
                    <v-divider />
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn @click="sendWhatsapp(customer.phoneNumber)" color="#3fc151" fab small>
                      <v-icon>
                        smartphone
                      </v-icon>
                    </v-btn>
                    <v-divider />
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios"
export default {
  data () {
    return {
      dialog: false,
      selectedUser: null,
      valid: true,
      callingCode: '56',
      customerToUpload: {
        firstName: null,
        rut: null
      },
      rutToGetCustomer: null,
      customers: [],
      nameRules: [
        v => !!v || 'Debe ingresar su nombre',
        v => (v && v.length > 2) || 'El nombre debe tener más de 2 caracters'
      ],
      lastNameRules: [
        v => !!v || 'Debe ingresar su apellido',
        v => (v && v.length > 2) || 'El apellido debe tener más de 2 caracters'
      ],
      activityRules: [
        v => !!v || 'Debe ingresar su sección de trabajo o actividad',
        v => (v && v.length > 2) || 'La actividad debe tener más de 2 caracters'
      ],
      rutRules: [
        v => !!v || 'Debe ingresar su rut',
        v => (v && v.length > 8 && v.length < 11) || 'Debe ingresar su rut de la siguiente forma: 12345678-9'
      ],
      phoneRules: [
        v => !!v || 'Debe ingresar su celular',
        v => (v && v.length > 8 && v.length < 10) || 'Ingresar su celular de la siguiente manera: 912345678, sin anteponer +56'
      ],
      mailRules: [
        v => !!v || 'Debe ingresar su correo electrónico',
        v => (v && v.length > 4) || 'Ingresar correo corectamente, ejemplo: nombre@gmail.com'
      ]
    }
  },

  computed: {
    serverURL () {
      return this.$store.state.general.serverURL
    },
    customer () {
      return this.$store.state.general.customer
    }
  },
  async created(){
    await this.getCustomers()
  },

  methods: {
    async getCustomers(){
      await axios
          .get(this.serverURL + '/images/pathsWithCustomer')
          .then(response => {
            //this.customers.length = 0
            // mensaje
            //this.customers = response.data
            console.log('customers loaded')
            console.log(response.data)
            response.data.forEach(element => {
              var customer = null
              console.log(element)
              customer = element.customer
              customer.photos = element.paths
              this.customers.push(customer)
            });
          })
          .catch(e => {
            console.log(e, e.response)
            this.file = ''
          })
    },
    sendWhatsapp(phoneNumber){
      window.open('whatsapp://send?' + '&phone=' + this.callingCode + phoneNumber + '&abid=' + this.callingCode + phoneNumber)
      console.log(phoneNumber)
    },
    async register () {
      const self = this
      await this.createCustomer()
      if (this.$refs.form.validate()) {
        return self.$router.push({ path: `/users/${self.customerToUpload.rut}` })
      }
    },
    async toUploadPhotosView (rut) {
      const self = this
      this.rutToGetCustomer = rut
      await this.getCustomerByRut()
      return self.$router.push({ path: `/users/${self.customerToUpload.rut}` })
    },

    async createCustomer(store){
      this.customerToUpload.deleted = false
      await axios
      .post(`${this.serverURL}/customers/create`, this.customerToUpload)
        .then(response => {
          this.$store.dispatch('user/editCustomer', response.data)
          console.log(response.data)

        })
        .catch(e => {
          console.log('error'+e)
        })
    },

    async getCustomerByRut(store){
      await axios
      .get(`${this.serverURL}/customers/byRut/`+ this.rutToGetCustomer)
        .then(response => {
          this.$store.dispatch('user/editCustomer', response.data)
          console.log(response.data)

        })
        .catch(e => {
          console.log('error'+e)
        })
    },

    showDialog (rut) {
      this.dialog = true
      this.selectedUser = rut
    },

    hideDialog () {
      this.dialog = false
      this.selectedUser = null
    },

    async deleteUpload () {
      if (this.selectedUser) {
        await axios
        .delete(`${this.serverURL}/customers/delete/byRut/`+ this.selectedUser)
          .then(response => {
            //this.getCustomers()
            console.log(response.data)
            //return this.$router.push({ path: `/users` })

          })
          .catch(e => {
            console.log('error'+e)
          })
          this.selectedUser = null
          this.dialog = false
      }
    }
  }
}
</script>
