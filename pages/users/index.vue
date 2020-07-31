<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-actions>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="customer.name"
              :rules="nameRules"
              label="Ingrese su nombre"
              required
            />
            <v-text-field
              v-model="customer.rut"
              :rules="nameRules"
              label="Ingrese su rut"
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
        </v-card-actions>
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
      </v-card>
    </v-flex>
    <v-flex xs12>
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
              {{ user.name }}
              <v-divider />
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-btn :to="'/users/' + user.name" color="primary" fab small>
              <v-icon>
                add_a_photo
              </v-icon>
            </v-btn>
            <v-divider />
          </v-list-item-action>
          <v-list-item-action>
            <v-btn @click="showDialog(user.name)" color="primary" fab small>
              <v-icon>
                close
              </v-icon>
            </v-btn>
            <v-divider />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      selectedUser: null,
      valid: true,
      customer: {
        name: null,
        rut: null
      },
      nameRules: [
        v => !!v || 'Full name is required',
        v => (v && v.length > 2) || 'Name must be more than 2 characters'
      ]
    }
  },

  computed: {
    users () {
      return this.$store.state.user.list
    }
  },
  fetch ({ store }) {
    return store.dispatch('user/getAll')
  },

  methods: {
    register () {
      const self = this
      if (this.$refs.form.validate()) {
        return this.$store.dispatch('user/register', this.customer.rut)
          .then(() => {
            return self.$router.push({ path: `/users/${self.customer.rut}` })
          })
      }
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
