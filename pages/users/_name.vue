<template>
<v-container>
  <v-layout row wrap align-center>
    <v-flex xs12 md10 lg10>
      <v-dialog v-model="dialog" persistent max-width="320">
        <v-card>
          <v-card-title class="headline">
            Advertencia!
          </v-card-title>
          <v-card-text>¿Está seguro que desea eliminar esta imágen?</v-card-text>
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
    </v-flex>
    <v-flex xs12>
      <v-tabs
        v-model="tab"
        centered
        color="white"
        dark
        icons-and-text
      >
      <center>
        <h1>Imágenes Cliente : {{ customer.firstName }} {{ customer.lastName }}</h1>
      </center>
        <v-tabs-slider color="blue" />
<!--         <v-tab href="#tab-2">
          Camara
          <v-icon>camera</v-icon>
        </v-tab> -->
        <v-tab-item
          value="tab-1"
        >
              <v-file-input
                v-model="files"
                color="deep-purple accent-4"
                counter
                multiple
                placeholder="Cargue aquí sus archivos"
                prepend-icon="mdi-paperclip"
                outlined
                :show-size="1000"
              >
                <template v-slot:selection="{ index, text }">
                  <v-chip
                    v-if="index < 2"
                    color="deep-purple accent-4"
                    dark
                    label
                    small
                  >
                    {{ text }}
                  </v-chip>

                  <span
                    v-else-if="index === 2"
                    class="overline grey--text text--darken-3 mx-2"
                  >
                    +{{ files.length - 2 }} File(s)
                  </span>
                </template>
              </v-file-input>
              <center>
                <v-btn @click="uploadFiles()" color="primary">
                  <v-icon>cloud_upload_</v-icon> Subir Imágenes
                </v-btn>
              </center>
            <br><br>
        </v-tab-item>

        <v-tab-item
          value="tab-2"
        >
          <v-card flat>
            <v-btn v-if="isCameraStarted" @click="takePhoto" color="blue">
              Take photo
            </v-btn>
            <v-layout row wrap>
              <v-flex xs12 md6>
                <video
                  id="live-video"
                  v-if="isCameraStarted"
                  width="320"
                  height="247"
                  autoplay
                />
              </v-flex>
              <v-flex xs12 md6>
                <canvas
                  id="live-canvas"
                  width="320"
                  height="247"
                />
              </v-flex>
            </v-layout>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-flex>
    <v-flex v-for="(photo, index) in photos"
            :key="photo"
            xs12 md6 lg4
    >
      <v-card flat tile class="d-flex">
        <v-btn
          @click="showDialog(photo)"
          fab
          small
          color="blue"
          dark
        >
          <v-icon>close</v-icon>
        </v-btn>
        <img :id="customer.rut + index" :src="photo">
      </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
import axios from "axios"
import { mapActions } from "vuex"
export default {
  data () {
    return {
      step: 1,
      dialog: false,
      fab: true,
      tab: 'tab-1',
      multiple: true,
      selectedPhoto: null,
      files: [],
      customers: [],
      photos:[]
    }
  },
  computed: {
    serverURL () {
      return this.$store.state.general.serverURL
    },
    isCameraStarted () {
      return this.$store.getters['camera/isCameraStarted']
    },
    customer () {
      return this.$store.getters['user/getCustomer']
    }
  },
  watch: {
    async tab (val) {
      if (this.tab === 'tab-2') {
        await this.$store.dispatch('camera/startCamera')
          .then((stream) => {
            const videoDiv = document.getElementById('live-video')
            videoDiv.srcObject = stream
          })
      } else {
        await this.$store.dispatch('camera/stopCamera')
      }
    }
  },
  beforeDestroy () {
    this.$store.dispatch('camera/stopCamera')
  },
  methods: {
    async loadPaths(){
      await axios
          .get(`${this.serverURL}/images/pathsByCustomer/${this.actualCustomer.id}`)
          .then(response => {
            // mensaje
            console.log('paths loaded')
            console.log(this.actualCustomer)
          })
          .catch(e => {
            console.log(e, e.response)
          })
    },
    showDialog (photo) {
      this.dialog = true
      this.selectedPhoto = photo
    },

    hideDialog () {
      this.dialog = false
      this.selectedPhoto = null
    },

    async deleteUpload () {
      if (this.selectedPhoto) {
        const comps = this.selectedPhoto.split('/')
        await this.$store.dispatch('user/deletePhoto', {
          user: this.user.name,
          file: comps[comps.length - 1]
        })
        this.selectedPhoto = null
        this.dialog = false
      }
    },
    async uploadFiles () {
      let formData = new FormData()
      this.files.forEach(element => {
        formData.append('file', element)
      });
      await axios.post(`${this.serverURL}/images/uploadImages/${this.customer.rut}`, formData)
        .then(response => {
          const result = response.data
          this.photos = response.data
          if (result.length !== 0) {
            console.log('Images loaded')
            return this.$store.dispatch('user/getAll')
          } else {
            console.log('There is a problem with charge the images.')
          }
        })
        .catch(e => {
          console.log('uploadFiles', e, e.response)
        })
    },
    async takePhoto () {
      const video = document.getElementById('live-video')
      const canvas = document.getElementById('live-canvas')
      const canvasCtx = canvas.getContext('2d')
      canvasCtx.drawImage(video, 0, 0, 320, 247)
      const content = canvas.toDataURL('image/jpeg')
      await this.$store.dispatch('user/uploadBase64', {
        user: this.user.name,
        content
      })
    }
  }
}
</script>

<style scoped>
  img{
      width:100%;
      max-width:200px;
  }
</style>
