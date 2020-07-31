<template>
  <v-layout row wrap align-center>
    <v-flex xs12>
      <h1>Photos: {{ user.name }}</h1>
      <v-dialog v-model="dialog" persistent max-width="320">
        <v-card>
          <v-card-title class="headline">
            Warning!
          </v-card-title>
          <v-card-text>Are you sure you want to delete this photo</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="hideDialog()" color="green darken-1" flat>
              Disagree
            </v-btn>
            <v-btn @click="deleteUpload()" color="green darken-1" flat>
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
    <v-flex xs12>
      <v-tabs
        v-model="tab"
        centered
        color="green-lighten2"
        dark
        icons-and-text
      >
        <v-tabs-slider color="yellow" />

        <v-tab href="#tab-1">
          Upload
          <v-icon>cloud_upload</v-icon>
        </v-tab>

        <v-tab href="#tab-2">
          Camera
          <v-icon>camera</v-icon>
        </v-tab>

        <v-tab-item
          value="tab-1"
        >
          <v-card flat>
            <button @click="uploadFiles()">Upload FILES</button>
              <v-file-input
                v-model="files"
                color="deep-purple accent-4"
                counter
                label="File input"
                multiple
                placeholder="Select your files"
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
            <form method="POST" class="form-documents" enctype="multipart/form-data">
              Upload photos
              <input id="fileUpload" :multiple="multiple" @change="filesChange($event.target.name, $event.target.files)" type="file" name="fileUpload">
            </form>
          </v-card>
        </v-tab-item>

        <v-tab-item
          value="tab-2"
        >
          <v-card flat>
            <v-btn v-if="isCameraStarted" @click="takePhoto" color="secondary">
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
    <v-flex v-for="(photo, index) in user.photos"
            :key="photo"
            xs12 md6 lg4
    >
      <v-card flat tile class="d-flex">
        <v-btn
          @click="showDialog(photo)"
          fab
          small
          color="primary"
          dark
        >
          <v-icon>close</v-icon>
        </v-btn>
        <img :id="user.name + index" :src="photo">
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from "axios"
export default {
  data () {
    return {
      step: 1,
      dialog: false,
      fab: true,
      tab: 'tab-1',
      multiple: true,
      selectedPhoto: null,
      files: []
    }
  },
  computed: {
    user () {
      const userByName = this.$store.getters['user/userByName']
      return userByName(this.$route.params.name)
    },
    users () {
      return this.$store.state.user.list
    },
    isCameraStarted () {
      return this.$store.getters['camera/isCameraStarted']
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

  fetch ({ store }) {
    if (!store.getters['user/isFetched']) {
      return store.dispatch('user/getAll')
    }
  },
  beforeDestroy () {
    this.$store.dispatch('camera/stopCamera')
  },
  methods: {
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
    filesChange (fieldName, fileList) {
      console.log(fieldName)
      console.log(fileList)
      const self = this
      const formData = new FormData()
      formData.append('user', self.user.name)
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], 'jpg')
        console.log(fieldName)
        console.log(fileList[x])
        console.log(this.user.name)
      })
      return self.$store.dispatch('user/upload', formData)
        .then((result) => {
          if (document) {
            document.getElementById('fileUpload').value = ''
          }
        })
    },
    async uploadFiles () {
      let formData = new FormData()
      console.log(this.files)
      this.files.forEach(element => {
        formData.append('file', element)
      });
      await axios.post(`http://104.131.15.22:8080/backend-tracking4d/images/uploadImages/Atanas`, formData)
        .then(response => {
          const result = response.data
          if (result.length !== 0) {
            console.log('Images loaded')
            this.getUsers()
              .then((users) => {
                self.step += users.length
              })
          } else {
            console.log('There is a problem with charge the images.')
          }
        })
        .catch(e => {
          console.log('getProduct', e, e.response)
        })
    },
    async getUsers(){
      await store.dispatch('user/getAll')
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
