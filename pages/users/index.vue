<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm8 offset-sm2 align-center justify-center>
        <v-card class="elevation-12">
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="personToUpload.firstName"
                  :rules="nameRules"
                  label="Nombres"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="personToUpload.lastName"
                  :rules="lastNameRules"
                  label="Apellidos"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="personToUpload.rut"
                  :rules="rutRules"
                  label="Rut"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="personToUpload.activity"
                  :rules="activityRules"
                  label="Sección de trabajo o actividad"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="personToUpload.mail"
                  label="Correo electrónico"
                  type="email"
                  :rules="mailRules"
                  autocomplete="off"
                  required
                />
                <v-text-field
                  v-model="personToUpload.phoneNumber"
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
                <v-list-item v-for="person in persons" :key="person.rut">
                  <v-list-item-avatar>
                    <v-avatar
                      slot="activator"
                      size="32px"
                    >
                      <img
                        v-if="person.photos.length"
                        :src="person.photos[0]"
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
                      <h2> Nombre Cliente: {{ person.firstName }} {{ person.lastName }} </h2>
                      <v-divider />
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn @click="showDialog(person.rut)" color="primary" fab small>
                      <v-icon>
                        close
                      </v-icon>
                    </v-btn>
                    <v-divider />
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn @click="toUploadPhotosView(person.rut)" color="primary" fab small>
                      <v-icon>
                        add_a_photo
                      </v-icon>
                    </v-btn>
                    <v-divider />
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn @click="sendWhatsapp(person.phoneNumber)" color="#3fc151" fab small>
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
      personToUpload: {
        firstName: null,
        rut: null
      },
      rutToGetPerson: null,
      persons: [],
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
    person () {
      return this.$store.state.general.person
    }
  },
  async created(){
    await this.getPersons()
  },

  methods: {
    async getPersons(){
      await axios
          .get(this.serverURL + '/images/pathsWithPerson')
          .then(response => {
            console.log('persons loaded')
            response.data.forEach(element => {
              var person = null
              person = element.person
              person.photos = element.paths
              this.persons.push(person)
            });
          })
          .catch(e => {
            console.log(e, e.response)
            this.file = ''
          })
    },
    sendWhatsapp(phoneNumber){
      window.open('whatsapp://send?' + '&phone=' + this.callingCode + phoneNumber + '&abid=' + this.callingCode + phoneNumber)
    },
    async register () {
      const self = this
      if (this.$refs.form.validate()) {
        await this.createPerson()
        return self.$router.push({ path: `/users/${self.personToUpload.rut}` })
      }
    },
    async toUploadPhotosView (rut) {
      const self = this
      this.rutToGetPerson = rut
      await this.getPersonByRut()
      return self.$router.push({ path: `/users/${self.rutToGetPerson}` })
    },

    async createPerson(store){
      this.personToUpload.deleted = false
      await axios
      .post(`${this.serverURL}/persons/create`, this.personToUpload)
        .then(response => {
          this.$store.dispatch('user/editPerson', response.data)
        })
        .catch(e => {
          console.log('error'+e)
        })
    },

    async getPersonByRut(store){
      await axios
      .get(`${this.serverURL}/persons/byRut/`+ this.rutToGetPerson)
        .then(response => {
          this.$store.dispatch('user/editPerson', response.data)
          console.log('correct edit')

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
        .delete(`${this.serverURL}/persons/delete/byRut/`+ this.selectedUser)
          .then(response => {
            console.log("Person deleted")
            this.persons = response.data
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
