<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm8 offset-sm2 align-center justify-center>
        <v-card class="elevation-12">
          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="customer.firstName"
                  :rules="nameRules"
                  label="Nombres"
                  required
                />
                <v-text-field
                  v-model="customer.lastName"
                  :rules="lastNameRules"
                  label="Apellidos"
                  required
                />
                <v-text-field
                  v-model="customer.rut"
                  :rules="rutRules"
                  label="Rut"
                  required
                />
                <v-text-field
                  v-model="customer.activity"
                  :rules="activityRules"
                  label="Sección de trabajo o actividad"
                  required
                />
                <v-text-field
                  v-model="customer.mail"
                  label="Correo electrónico"
                  type="email"
                  required
                />
                <v-text-field
                  v-model="customer.phoneNumber"
                  :rules="phoneRules"
                  label="Celular"
                  type="number"
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
            <v-btn @click="hideDialog()" color="blue" flat>
              Cancelar
            </v-btn>
            <v-btn @click="deleteUpload()" color="blue" flat>
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
                <v-list-item v-for="user in users" :key="user.name">
                  <v-list-item-avatar>
                    <v-avatar
                      slot="activator"
                      size="32px"
                    >
                      <img
                        v-if="user.photos.length"
                        :src="user.photos[0]"
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
                      <h2> Rut Cliente: {{ user.name }} </h2>
                      <v-divider />
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn @click="showDialog(user.name)" color="primary" fab small>
                      <v-icon>
                        close
                      </v-icon>
                    </v-btn>
                    <v-divider />
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn :to="'/users/' + user.name" color="primary" fab small>
                      <v-icon>
                        add_a_photo
                      </v-icon>
                    </v-btn>
                    <v-divider />
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn @click="showDialog(user.name)" color="#3fc151" fab small>
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
      customer: {
        firstName: null,
        rut: null
      },
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
        v => (v && v.length > 7 && v.length < 12) || 'Debe ingresar su celular de la siguiente manera: 56912345678'
      ],
      mailRules: [
        v => !!v || 'Debe ingresar su correo electrónico',
      ]
    }
  },

  computed: {
    users () {
      return this.$store.state.user.list
    },
    serverURL () {
      return this.$store.state.general.serverURL
    },
  },
  fetch ({ store }) {
    return store.dispatch('user/getAll')
  },

  methods: {
    register () {
      const self = this
      this.createCustomer()
      if (this.$refs.form.validate()) {
        return this.$store.dispatch('user/register', this.customer.rut)
          .then(() => {
            return self.$router.push({ path: `/users/${self.customer.rut}` })
          })
      }
    },

    async createCustomer(){
      await axios
      .post(`${this.serverURL}/customers/create`, this.customer)
        .then(response => {
          console.log(response.data)
        })
        .catch(e => {
          console.log('error'+e)
        })
    },

    showDialog (name) {
      this.dialog = true
      this.selectedUser = name
    },

    hideDialog () {
      this.dialog = false
      this.selectedUser = null
    },

    async deleteUpload () {
      if (this.selectedUser) {
        await this.$store.dispatch('user/delete', this.selectedUser)
        this.selectedUser = null
        this.dialog = false
      }
    }
  }
}
</script>
