<template>
  <div id="person-crate">
    <v-container fill-height fluid grid-list-xl>
      <v-layout justify-center wrap>
        <v-flex md12>
          <material-card
            :dark="nightMode"
            class="card-tabs"
            color="secondary"
          >
            <v-flex
              xs10 offset-xs1
              slot="header"
            >
              <v-tabs
                v-model="tabs"
                color="white"
                background-color="transparent"
                slider-color="white"
              >
                <span class="subheading">
                  <v-icon>assignment</v-icon>
                  REGISTRO DE CLIENTES
                </span>
                <v-spacer></v-spacer>
                <center>
                  <span class="subheading">
                      <v-btn @click="clean" outlined>
                        <v-icon>replay</v-icon>
                        Limpiar campos
                      </v-btn>
                  </span>
                </center>
              </v-tabs>
            </v-flex>
          <v-form @submit.prevent="saveChanges" ref="form">
            <v-container>
              <v-layout>
                <v-flex
                  xs12
                  md9
                >
                  <v-layout>
                    <v-flex
                      xs12
                      md6
                    >
                      <v-text-field
                        color="warning"
                        v-model="person.firstName"
                        :rules="regularRules"
                        autocomplete="off"
                        label="Nombres"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      md6
                    >
                      <v-text-field
                        color="warning"
                        v-model="person.lastName"
                        label="Apellidos"
                        autocomplete="off"
                        required
                        :rules="regularRules"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                      <v-flex
                      xs12
                      md4
                    >
                      <v-text-field
                        color="warning"
                        v-model="person.rut"
                        autocomplete="off"
                        label="Rut"
                        :rules="regularRules"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      md4
                    >
                      <v-text-field
                        color="warning"
                        type="number"
                        class="inputNumber"
                        v-model="person.phoneNumber"
                        label="Número de celular"
                        :rules="numberRules"
                        autocomplete="off"
                        value=""
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                      xs12
                      md4
                    >
                    <v-text-field
                        color="warning"
                        v-model="person.genre"
                        autocomplete="off"
                        label="Género"
                        :rules="regularRules"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout>
                    <v-flex
                      xs12
                      md8
                    >
                    <v-text-field
                        color="warning"
                        v-model="person.mail"
                        autocomplete="off"
                        label="Correo"
                        :rules="regularRules"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex
                    xs12
                    md3
                  >
                    <v-btn block type="submit" :disabled="loadConfirm" :loading="loadConfirm" class="ma-2" color="secondary">
                      <span>Registrar Cliente</span><v-icon>check</v-icon>
                    </v-btn>
                    <v-btn block @click="back" class="ma-2" color="blue darken-2" dark>
                      <v-icon dark left>arrow_back</v-icon>Cancelar
                    </v-btn>
                    <br>
                  </v-flex>
                  </v-layout>
                  </v-flex>
                  <v-flex
                    xs12
                    md3
                  >
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import MaterialCard from '@/components/home/material/card.vue'

export default {
  name: 'person-create',
  components: {
    'material-card': MaterialCard
  },
  data () {
    return {
      regularRules: [
        // eslint-disable-next-line
        v => !!v || 'Este campo es obligatorio'
      ],
      numberRules: [
        // eslint-disable-next-line
        v => parseInt(v) >= 0 && !!v || 'Debe ingresar una cantidad mayor o igual a cero'
      ],
      tabs: 0,
      file: [],
      loadConfirm: false
    }
  },
  async created () {
    this.person = {}
  },
  methods: {
    ...mapActions([
      'getPerson',
      'getPersons',
      'editPerson',
      'setSnackbarAlert',
      'register'
    ]),
    getImageUrl () {
      this.imageURL = this.serverURL + '/persons/web/' + `${this.person.id}` + '/getprincipalimage/' + '?' + Math.random()
    },
    back () {
      this.createDialogPerson = false
    },
    async saveChanges () {
      if (this.$refs.form.validate()) {
        this.loadConfirm = true
        this.newPerson = this.person
        await this.register()
        this.loadConfirm = false
        this.createDialogPerson = false
        this.getPersons()
        this.person = {}
        this.newPerson = {}
      }
    },
    async uploadImage () {
      if (this.personImageList.length === 0) {
        let formData = new FormData()
        formData.append('file', this.file)
        await axios
          .post(this.serverURL + '/persons/' + `${this.person.id}` + '/uploadImage', formData)
          .then(response => {
            this.file = ''
          })
          .catch(e => {
            console.log(e, e.response)
            this.setSnackbarAlert({ color: 'error', timeout: 2500, message: 'No se ha podido cargar la imagen' })
            this.file = ''
          })
      } else {
        let formData = new FormData()
        formData.append('file', this.file)
        await axios
          .post(this.serverURL + '/persons/' + `${this.person.id}` + '/changePrincipalImage', formData)
          .then(response => {
            this.file = ''
          })
          .catch(e => {
            console.log(e, e.response)
            this.setSnackbarAlert({ color: 'error', timeout: 2500, message: 'No se ha podido cargar la imagen' })
            this.file = ''
          })
      }
    },
    chargeImage () {
      if (this.file !== null && this.file.length !== 0) {
        this.imageURL = URL.createObjectURL(this.file)
      } else {
        this.imageURL = 'http://www.mayline.com/persons/images/person/noimage.jpg'
      }
    },
    async clean () {
      this.file = []
      this.person = {}
      this.category = {}
      this.imageURL = ''
      await this.$refs.form.reset()
      await this.errors.clear()
    }
  },
  computed: {
    ...mapState([
      'nightMode',
      'categories',
      'companies',
      'serverURL',
      'subCategory'
    ]),
    person: {
      get () { return this.$store.state.person },
      set (payload) { this.$store.commit('updatePerson', payload) }
    },
    personId: {
      get () { return this.$store.state.personId },
      set (payload) { this.$store.commit('updatePersonId', payload) }
    },
    category: {
      get () { return this.$store.state.category },
      set (payload) { this.$store.commit('updateCategory', payload) }
    },
    imageURL: {
      get () { return this.$store.state.imageURL },
      set (payload) { this.$store.commit('updateImageURL', payload) }
    },
    createDialogPerson: {
      get () { return this.$store.state.createDialogPerson },
      set (payload) { this.$store.commit('updateCreateDialogPerson', payload) }
    },
    newPerson: {
      get () { return this.$store.state.newPerson },
      set (payload) { this.$store.commit('updateNewPerson', payload) }
    },
    referencePerson: {
      get () { return this.$store.state.referencePerson },
      set (payload) { this.$store.commit('updateReferencePerson', payload) }
    },
    personImageList: {
      get () { return this.$store.state.personImageList },
      set (payload) { this.$store.commit('updatePersonImageList', payload) }
    },
    categoryPlaceholder: {
      get () { return this.$store.state.categoryPlaceholder },
      set (payload) { this.$store.commit('updateCategoryPlaceholder', payload) }
    },
    providerPlaceholder: {
      get () { return this.$store.state.providerPlaceholder },
      set (payload) { this.$store.commit('updateProviderPlaceholder', payload) }
    },
    subCategoryPlaceholder: {
      get () { return this.$store.state.subCategoryPlaceholder },
      set (payload) { this.$store.commit('updateSubCategoryPlaceholder', payload) }
    },
    companyPlaceholder: {
      get () { return this.$store.state.companyPlaceholder },
      set (payload) { this.$store.commit('updateCompanyPlaceholder', payload) }
    }
  }
}
</script>

<style>
  .subheading {
    align-self: center;
    font-weight: 600;
  }
  /* Quitar default arrows del input number */
  .inputNumber input[type='number'] {
    -moz-appearance: textfield !important;
  }
  .inputNumber input::-webkit-inner-spin-button,
  .inputNumber input::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    margin: 0 !important;
  }
  .number input[type='number'] {
    -moz-appearance: textfield !important;
  }
  .number input::-webkit-inner-spin-button,
  .number input::-webkit-outer-spin-button {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    margin: 0 !important;
  }
</style>

<style scoped>
  .v-input__slider {
    width: 100%;
  }
</style>
