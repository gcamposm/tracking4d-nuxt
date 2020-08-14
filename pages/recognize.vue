<template>
  <v-layout row
            align-center
            justify-center
            wrap
  >
  <v-container fluid>
    <center>
      <v-flex>
        <h1>Reconocimiento Facial - Cámara {{camId}} </h1>
      </v-flex>
    </center>
    <v-flex xs12>
      <center>
        <v-progress-circular
          v-if="isProgressActive"
          :rotate="360"
          :size="100"
          :width="15"
          :value="progress"
          color="blue"
        >
          Cargando
        </v-progress-circular>
      </center>
    </v-flex>
    <v-flex v-if="!isProgressActive" xs12>
      <v-card>
        <v-card-actions class="justify-center">
          <v-btn-toggle v-model="withOptions" multiple>
            <v-btn>
              <v-icon>check_box_outline_blank</v-icon>
              <span>Detección Simple</span>
            </v-btn>
            <v-btn>
              <v-icon>face</v-icon>
              <span>Puntos Faciales</span>
            </v-btn>
            <v-btn>
              <v-icon>how_to_reg</v-icon>
              <span>Reconocimiento</span>
            </v-btn>
            <v-btn>
              <v-icon>insert_emoticon</v-icon>
              <span>Emociones</span>
            </v-btn>
          </v-btn-toggle>
        </v-card-actions>
        <!-- <v-slider v-model="fps"
                  :max="60"
                  :min="1"
                  :step="1"
                  label="FPS"
                  prepend-icon="local_movies"
                  thumb-label="always"
                  ticks
        /> -->
        <p>
          <v-chip label color="blue" text-color="white">
            <v-icon left>
              local_movies
            </v-icon> FPS: {{ realFps }}
          </v-chip>
          <v-chip label color="blue" text-color="white">
            <v-icon left>
              timer
            </v-icon> Duración: {{ duration }} ms
          </v-chip>
        </p>
      </v-card>
    </v-flex>
    <v-flex xs12 md12>
      <video
        id="live-video"
        width="1000"
        height="580"
        autoplay
        hidden
      />
    </v-flex>
    <v-flex xs12 md12>
      <center>
        <canvas
          id="live-canvas"
          width="1000"
          height="580"
        />
      </center>
    </v-flex>
  </v-container>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import axios from "axios"
export default {
  data () {
    return {
      interval: null,
      realEmotion: 'neutral',
      emotion: 0,
      fps: 1,
      realFps: 0,
      step: 2,
      counter: 0,
      progress: 0,
      duration: 0,
      isProgressActive: true,
      recognition: '',
      withOptions: [0, 1, 2, 3],
      camId: 1,
    }
  },

  computed: {
    ...mapState([
    ]),
    models () {
      return this.$store.state.model.list
    },
    serverURL () {
      return this.$store.state.general.serverURL
    }
  },

  watch: {
    fps (newFps) {
      const videoDiv = document.getElementById('live-video')
      const canvasDiv = document.getElementById('live-canvas')
      const canvasCtx = canvasDiv.getContext('2d')
      this.start(videoDiv, canvasDiv, canvasCtx, newFps)
    }
  },

  async beforeMount () {
    const self = this
    await this.getFaces()
      .then(() => self.$store.dispatch('face/getFaceMatcher'))
  },
  async mounted () {
    await this.recognize()
  },

  beforeDestroy () {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.$store.dispatch('camera/stopCamera')
  },

  methods: {
    async getFaces (){
          await axios
          .get(`${this.serverURL}/images/getAllFaces`)
          .then(response => {
            this.$store.dispatch('face/editFaces', response.data)
            console.log('Faces loaded')
          })
          .catch(e => {
            console.log(e, e.response)
          })
    },
    async saveMatches (filteredMatches){
      console.log('filteredMatches')
      console.log(filteredMatches)
      let formData = new FormData()
          formData.append('matches', filteredMatches)
          formData.append('cameraId', 1)
          await axios
          .post(`${this.serverURL}/matches/create/withFilteredMatches`, formData)
          .then(response => {
            console.log('matches saved')
          })
          .catch(e => {
            console.log(e, e.response)
          })
    },
    async saveUnknowns (unknownList){
      unknownList.forEach(unknown => {
        this.saveUnknown(unknown)
      });
    },
    async saveUnknown (unknown){
      let formData = new FormData()
          formData.append('unknown', unknown)
          formData.append('cameraId', this.camId)
          await axios
          .post(`${this.serverURL}/detections/saveUnknown`, formData)
          .then(response => {
            // mensaje
            console.log('unknown saved')
          })
          .catch(e => {
            console.log(e, e.response)
          })
    },
    start (videoDiv, canvasDiv, canvasCtx, fps) {
      const self = this
      if (self.interval) {
        clearInterval(self.interval)
      }
      var matchList = []
      var unknownList = []
      self.interval = setInterval(async () => {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var second = today.getSeconds();
        if(second == "0"){
          let filteredMatches = [...new Set(matchList)];
          this.saveMatches(filteredMatches)
          this.saveUnknowns(unknownList)
          filteredMatches.length=0
        }
        const t0 = performance.now()
        canvasCtx.drawImage(videoDiv, 0, 0, 1000, 580)
        const options = {
          detectionsEnabled: self.withOptions.find(o => o === 0) === 0,
          landmarksEnabled: self.withOptions.find(o => o === 1) === 1,
          descriptorsEnabled: self.withOptions.find(o => o === 2) === 2,
          expressionsEnabled: self.withOptions.find(o => o === 3) === 3
        }
        const detections = await self.$store.dispatch('face/getFaceDetections', { canvas: canvasDiv, options })
        if (detections.length) {
          if (self.isProgressActive) {
            self.increaseProgress()
            self.isProgressActive = false
          }
          detections.forEach(async (detection) => {
            this.emotion = 0
            if (detection.expressions.angry > this.emotion){
              this.emotion = detection.expressions.angry
              this.realEmotion = 'Enojado'
            }
            if (detection.expressions.digusted > this.emotion) {
              this.emotion = detection.expressions.disgusted
              this.realEmotion = 'Disgustado'
            }
            if (detection.expressions.fearful > this.emotion) {
              this.emotion = detection.expressions.fearful
              this.realEmotion = 'Temeroso'
            }
            if (detection.expressions.happy > this.emotion) {
              this.emotion = detection.expressions.happy
              this.realEmotion = 'Feliz'
            }
            if (detection.expressions.neutral > this.emotion) {
              this.emotion = detection.expressions.neutral
              this.realEmotion = 'Neutral'
            }
            if (detection.expressions.sad > this.emotion) {
              this.emotion = detection.expressions.sad
              this.realEmotion = 'Triste'
            }
            if (detection.expressions.surprised > this.emotion) {
              this.emotion = detection.expressions.surprised
              this.realEmotion = 'Sorprendido'
            }
            detection.recognition = await self.$store.dispatch('face/recognize', {
              descriptor: detection.descriptor,
              options,
              matchList,
              unknownList,
            })
            self.$store.dispatch('face/draw',
              {
                canvasDiv,
                canvasCtx,
                detection,
                options
              })
          })
        }
        const t1 = performance.now()
        self.duration = (t1 - t0).toFixed(2)
        self.realFps = (1000 / (t1 - t0)).toFixed(2)
      }, 1000 / fps)
    },
    async recognize () {
      const self = this
      self.increaseProgress()
      await self.$store.dispatch('camera/startCamera')
        .then((stream) => {
          const videoDiv = document.getElementById('live-video')
          const canvasDiv = document.getElementById('live-canvas')
          const canvasCtx = canvasDiv.getContext('2d')
          videoDiv.srcObject = stream

          self.increaseProgress()
          self.start(videoDiv, canvasDiv, canvasCtx, self.fps)
        })
    },

    increaseProgress () {
      const self = this
      self.progress = (100 / self.step) * ++self.counter
    }
  }
}
</script>
