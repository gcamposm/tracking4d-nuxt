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
            <v-btn @click="hideDialog()" color="blue" text>
              Cancelar
            </v-btn>
            <v-btn @click="deleteUpload()" color="blue" text>
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
    <v-flex xs12>
      <center>
        <h1>Imágenes Cliente : {{ person.firstName }} {{ person.lastName }}</h1>
      </center>
    </v-flex>
    <v-flex xs12>
      <v-tabs
        v-model="tab"
        centered
        color="white"
        dark
        icons-and-text
      >
        <v-tabs-slider color="blue" />
        <v-tab href="#tab-1">
          Cargar archivos
          <v-icon>camera</v-icon>
        </v-tab>
        <v-tab href="#tab-2">
          Camara
          <v-icon>camera</v-icon>
        </v-tab>
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
            <div>
              <br><br>
            </div>
        </v-tab-item>

        <v-tab-item
          value="tab-2"
        >
        <v-flex xs4 sm4 offset-sm4 align-center justify-center>
          <v-row>
            <center>
              <v-card class="elevation-12">
            <v-layout row wrap>
              <v-flex xs12 md6 justify-center>
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
            </center>
          </v-row>
          <v-row>
            <v-btn v-if="isCameraStarted" @click="takePhoto" color="blue">
              Capturar
          </v-btn>
          </v-row>
        
        </v-flex>
        </v-tab-item>
      </v-tabs>
      <v-progress-circular
        v-if="isProgressActive"
        :rotate="360"
        :size="100"
        :width="15"
        :value="progress"
        color="blue"
      >
        Entrenando
      </v-progress-circular>
    </v-flex>
    <v-flex v-for="(photo, index) in photos"
            :key="photo"
            xs12 md6 lg4
    >
      <v-card flat tile class="d-flex">
        <img :id="person.rut + index" :src="photo">
      </v-card>
    </v-flex>
    <v-flex v-for="(photo, index) in photosInPerson"
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
        <img :id="person.rut + index" :src="photo">
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
      persons: [],
      photos:[],
      photosInPerson: [],
      counter: 0,
      progress: 0,
      isProgressActive: false,
      rutToGetPerson: null,
      personToUpload: {
        firstName: null,
        rut: null
      },
      cameraPhoto: null
    }
  },
  computed: {
    serverURL () {
      return this.$store.state.general.serverURL
    },
    isCameraStarted () {
      return this.$store.getters['camera/isCameraStarted']
    },
    person () {
      return this.$store.getters['user/getPerson']
    }
  },
  async created(){
    await this.getActualPerson()
    this.photosInPerson = this.person.photos
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
    /* General Stuffs */
    showDialog (photo) {
      this.dialog = true
      this.selectedPhoto = photo
    },
    hideDialog () {
      this.dialog = false
      this.selectedPhoto = null
    },
    increaseProgress () {
      const self = this
      self.progress = (100 / self.step) * ++self.counter
    },
    resetProgress () {
      const self = this
      self.progress = self.counter = 0
      self.isProgressActive = true
    },
    /* Person Stuffs */
    async getActualPerson() {
      await axios
        .get(this.serverURL + '/persons/getActual')
        .then(response => {
          const result = response.data
          if (result.length !== 0) {
            var person = response.data.person
            person.photos = response.data.paths
            this.$store.dispatch('user/updatePerson', person)
          } else {
            console.log('Hubo un problema obteniendo a la persona.')
          }
        })
        .catch(e => {
          console.log('error' + e)
        })
    },
    /* Faces Stuffs */
    async loadFaces (){
      this.faces.forEach(face => {
        this.username = face.user
        face.descriptors.forEach(element => {
          let formData = new FormData()
          formData.append('rut', this.username)
          formData.append('descriptor', element.descriptor)
          formData.append('path', element.path)
          if(element.descriptor.length == 128)
          {
            this.saveDescriptorAwait(formData)
          }
        });
      });
      this.faces.length = 0
    },
    async saveDescriptorAwait(formData){
      await this.saveDescriptor(formData)
    },
    async saveDescriptor (formData) {
      await axios
        .post(`${this.serverURL}/images/create/withData`, formData)
        .then(response => {
          console.log('descriptors saved')
          this.increaseProgress()
          this.isProgressActive = false
        })
        .catch((e) => {
          this.isProgressActive = false
          console.error(e)
        })
    },
    async train () {
      const self = this
      self.resetProgress()
      const faces = []
        const descriptors = []
        await Promise.all(this.photos.map(async (photo, index) => {
          const photoId = `${this.person.rut}${index}`
          const img = document.getElementById(photoId)
          const options = {
            detectionsEnabled: true,
            landmarksEnabled: true,
            descriptorsEnabled: true,
            expressionsEnabled: false
          }
          const detections = await self.$store.dispatch('face/getFaceDetections', { canvas: img, options })
          detections.forEach((d) => {
            descriptors.push({
              path: photo,
              descriptor: d.descriptor
            })
          })
          self.increaseProgress()
        }))
        faces.push({
          user: this.person.rut,
          descriptors
        })
      this.faces = faces
      this.loadFaces()
    },
    /* File Stuffs */
    async deleteUpload () {
      if (this.selectedPhoto) {
      let formData = new FormData()
      formData.append('path', this.selectedPhoto)
      await axios
      .post(`${this.serverURL}/images/deleteWithPath`, formData)
          .then(response => {
            console.log('image deleted')
            this.photosInPerson = response.data
          })
          .catch(e => {
            console.log(e, e.response)
          })
      }
      this.dialog = false
      this.selectedPhoto = null
    },
    async uploadFiles () {
      await this.uploadFilesAux()
      await this.train()
    },
    async uploadFilesAux () {
      let formData = new FormData()
      this.files.forEach(element => {
        formData.append('file', element)
      });
      await axios.post(`${this.serverURL}/images/uploadImages/${this.person.rut}`, formData)
        .then(response => {
          const result = response.data
          this.photos = response.data
          if (result.length !== 0) {
            console.log('Images loaded')
          } else {
            console.log('There is a problem with charge the images.')
          }
        })
        .catch(e => {
          console.log('uploadFiles', e, e.response)
        })
    },
    /* Photos Stuffs */
    async uploadPhotos () {
      await this.uploadPhotosAux()
      await this.train()
    },
    async uploadPhotosAux () {
      let formData = new FormData()
      formData.append('imageValue', this.cameraPhoto)
      await axios.post(`${this.serverURL}/images/uploadPhotos/${this.person.rut}`, formData)
        .then(response => {
          const result = response.data
          this.photos.push(response.data)
          if (result.length !== 0) {
            console.log('Photos loaded')
            this.cameraPhoto = null
          } else {
            console.log('There is a problem with charge the photos.')
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
      const contentInApi = content.split(',')[1]
      this.cameraPhoto = contentInApi
      await this.uploadPhotos()
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