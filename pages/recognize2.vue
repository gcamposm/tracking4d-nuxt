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
    <v-flex xs12>
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
              <v-icon></v-icon>
              <span>Reconocimiento</span>
            </v-btn>
            <!-- <v-btn>
              <v-icon>insert_emoticon</v-icon>
              <span>Emociones</span>
            </v-btn> -->
          </v-btn-toggle>
        </v-card-actions>
        <v-flex xl3 md3 xs3>
          <v-text-field
          v-model="fpsToRefresh"
          label="FPS"
          type="number"
          autocomplete="off"
          required
        />
        </v-flex>
      </v-card>
    </v-flex>
    <v-flex xs12 md6>
      <video
        width="512"
        height="512"
        id="live-video"
        autoplay
        hidden
      />
    </v-flex>
    <v-flex xs12 md>
      <center>
        <canvas
          id="live-canvas"
          width="1024"
          height="1024"
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
      fpsToRefresh:1
    }
  },
  async created () {
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
      //this.start(videoDiv, canvasDiv, canvasCtx, newFps)
      this.start(videoDiv, canvasDiv, canvasCtx, this.fpsToRefresh)
      //this.refresh(videoDiv, canvasDiv, canvasCtx, this.fpsToRefresh)
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
    /* Alert Stuffs */

    hideDialog () {
      this.dialog = false
      this.idSelectedUser = null
    },
    /* Face Stuffs */
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
    async saveMatchesAux (matches){
      matches.forEach(match => {
        let formData = new FormData()
          formData.append('rut', match.rut)
          formData.append('cameraId', match.camId)
          this.saveMatches(formData)
      });
    },
    async saveMatches (formData){
          await axios
          .post(`${this.serverURL}/matches/create/withMatch`, formData)
          .then(response => {
            console.log('match saved')
          })
          .catch(e => {
            console.log(e, e.response)
          })
    },
    async saveUnknownsJson (unknownList){
      if(unknownList.length>0)
      {
        var unknown = unknownList[0]
        let formData = new FormData()
        formData.append('descriptors', unknown.descriptors)
        formData.append('photoUnknown', unknown.photo)
        formData.append('temperature', unknown.temperature)
        formData.append('isTemperature', false)
        this.saveUnknownsJsonAux(formData)
      }
    },
    async getDetectionCameraAux(formData){
      await this.getDetectionCamera(formData)
    },
    async getDetectionCamera(formData){
      await axios
            .post(`${this.serverURL}/cameras/getDetectionCamWithSplitCam4`, formData)
            .then(async (response) => {
              console.log("se obtuvo la cam")
              this.camId = response.data
            })
            .catch(e => {
              console.log('error al detectar la cam', e, e.response)
            })
    },
    async saveUnknownsJsonAux(formData){
      await axios
        .post(`${this.serverURL}/persons/createUnknown`, formData)
        .then(response => {
          // mensaje
          this.$store.dispatch('face/editFaces', response.data)
          console.log('unknown saved')
        })
        .catch(e => {
          console.log(e, e.response)
        })
    },
    /* Camera Stuffs */
    refresh (videoDiv, canvasDiv, canvasCtx, fps) {
      const self = this
      if (self.interval) {
        clearInterval(self.interval)
      }
      self.interval = setInterval(async () => {
        const t0 = performance.now()
        canvasCtx.drawImage(videoDiv, 0, 0, 800, 500)
        const t1 = performance.now()
        self.duration = (t1 - t0).toFixed(2)
        self.realFps = (1000 / (t1 - t0)).toFixed(2)
      }, 1000 / fps)
    },
    start (videoDiv, canvasDiv, canvasCtx, fps) {
      const self = this
      if (self.interval) {
        clearInterval(self.interval)
      }
      var matchList = []
      var unknownsJson = []
      self.interval = setInterval(async () => {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var second = today.getSeconds();
        //let filteredMatches = [...new Set(matchList)];
        await this.saveMatchesAux(matchList)
        //filteredMatches.length=0
        if((parseInt(second) % 4) == 0){
          await this.saveUnknownsJson(unknownsJson)
          unknownsJson.length=0
          await this.getFaces()
            .then(() => self.$store.dispatch('face/getFaceMatcher'))
        }
        const t0 = performance.now()
        canvasCtx.drawImage(videoDiv, 0, 0, 800, 500)
        const options = {
          detectionsEnabled: self.withOptions.find(o => o === 0) === 0,
          landmarksEnabled: self.withOptions.find(o => o === 1) === 1,
          descriptorsEnabled: self.withOptions.find(o => o === 2) === 2,
          expressionsEnabled: self.withOptions.find(o => o === 3) === 3
        }
        const content = canvasDiv.toDataURL('image/jpeg')
        const photoUnknown = content.split(',')[1]
        const detections = await self.$store.dispatch('face/getFaceDetections', { canvas: canvasDiv, options })
        detections.forEach(detection => {
          let formData = new FormData()
          formData.append('x', detection.detection._box._x | 0)
          formData.append('y', detection.detection._box._y | 0)
          formData.append('height', detection.detection._box._height | 0)
          formData.append('width', detection.detection._box._width | 0)
          this.getDetectionCameraAux(formData)
          detection.cam = this.camId
        });
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
              photoUnknown,
              descriptor: detection.descriptor,
              options,
              matchList,
              unknownsJson,
              camId: detection.cam
            })
            self.$store.dispatch('face/drawWithoutTemp',
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

