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
        <v-btn outlined @click="soundAlarm()">
          <v-icon class="mr-3"></v-icon>
          Alarma
        </v-btn>
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
          width="512"
          height="512"
        />
      </center>
    </v-flex>
    <v-dialog v-model="dialogAlarm" persistent max-width="1000" heigth="500">
        <v-card>
          <v-card-title class="headline">
            Advertencia!
          </v-card-title>
          <v-card-text>Se ha detectado una persona con una temperatura mayor a 38ºC</v-card-text>
          <v-card-text>Persona: </v-card-text>
          <v-card-text>Temperatura: </v-card-text>
          <v-card-text>Hora: </v-card-text>
          <v-card-text>Lugar: </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn href="http://localhost:8080/temperature-alert" color="blue" text>
              Ir al listado de Alertas
            </v-btn>
            <v-btn @click="hideDialog()" color="blue" text>
              Volver a la cámara
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import axios from "axios"
export default {
  data () {
    return {
      dialogAlarm: false,
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
    // const faces = await this.getFaces()
    // if(faces)
    // {
    //   self.$store.dispatch('face/getFaceMatcher')
    // }
    // else{
    //   return self.$router.push({ path: `/noFaces` })
    // }
      //.then(() => self.$store.dispatch('face/getFaceMatcher'))
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
    /* Face Stuffs */
    hideDialog () {
      this.dialog = false
      this.dialogAlarm = false
      this.idSelectedUser = null
    },
    async soundAlarm () {
      this.dialogAlarm = true
      var context = new AudioContext()
      var o = context.createOscillator()
      var g = context.createGain()
      o.connect(g)
      o.type = "sawtooth"
      o.frequency.value = 100
      g.connect(context.destination)
      o.start(0);
      g.gain.exponentialRampToValueAtTime(0.00001,context.currentTime+3)
    },
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
    async saveUnknownsJson (unknownList){
      unknownList.forEach(unknown => {
        let formData = new FormData()
          formData.append('descriptors', unknown.descriptors)
          formData.append('photoUnknown', unknown.photo)
          console.log("unknownphoto")
          console.log(unknown.photo)
          this.saveUnknownsJsonAux(formData)
      });
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
        if((parseInt(second) % 4) == 0){
        //if(true){
          let filteredMatches = [...new Set(matchList)];
          await this.saveMatches(filteredMatches)
          await this.saveUnknownsJson(unknownsJson)
          filteredMatches.length=0
        }
        const t0 = performance.now()
        canvasCtx.drawImage(videoDiv, 0, 0, 500, 500)
        const options = {
          detectionsEnabled: self.withOptions.find(o => o === 0) === 0,
          landmarksEnabled: self.withOptions.find(o => o === 1) === 1,
          descriptorsEnabled: self.withOptions.find(o => o === 2) === 2,
          expressionsEnabled: self.withOptions.find(o => o === 3) === 3
        }
        const content = canvasDiv.toDataURL('image/jpeg')
        const photoUnknown = content.split(',')[1]
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
              photoUnknown,
              descriptor: detection.descriptor,
              options,
              matchList,
              unknownsJson
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

