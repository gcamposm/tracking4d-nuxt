<template>
    <v-container >
      <v-layout row wrap>
        <v-flex xs12 sm12 align-center justify-center>
          <v-card class="elevation-12">
            <div>
              <br><br>
              <center><h1>Entrenamiento redes neuronales</h1></center>
              <br><br>
              <div class="grid">
                <center>
                  <v-btn @click="train()" color="primary">
                    ENTRENAR REDES NEURONALES
                  </v-btn>
                  <div>
                    <br><br>
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
                  </div>
                  <v-flex v-for="customer in customers" :key="customer.firstName" xs12>
                  
      <v-card>
        <v-card-title>
          <strong class="headline"> {{ customer.firstName }} {{ customer.lastName }}</strong>
          <v-btn @click="toUploadPhotosView(customer.rut)" style="margin-left: 3%;" fab dark small color="primary">
            <v-icon dark>
              add_a_photo
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-layout row
                  wrap
        >
            <v-flex v-for="(photo, index) in customer.photos"
                    :key="photo"
                    xs12 md6 lg4
            >
                <center>
                  <img :id="customer.rut + index" :src="photo">
                </center> 
            </v-flex>
          
        </v-layout>
      </v-card>
    </v-flex>
                </center>
              </div>
            </div>
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
      step: 1,
      counter: 0,
      progress: 0,
      isProgressActive: false,
      customers: [],
      rutToGetCustomer: null,
      customerToUpload: {
        firstName: null,
        rut: null
      },
    }
  },
  computed: {
    users () {
      return this.$store.state.user.list
    },
    serverURL () {
      return this.$store.state.general.serverURL
    }
  },
  async created(){
    await this.getCustomers()
  },

  async fetch ({ store }) {
    const self = this
    await store.dispatch('user/getAll')
      .then((users) => {
        self.step += users.length
      })
  },

  methods: {
    async toUploadPhotosView (rut) {
      const self = this
      this.rutToGetCustomer = rut
      await this.getCustomerByRut()
      return self.$router.push({ path: `/users/${self.customerToUpload.rut}` })
    },
    async getCustomerByRut(store){
      await axios
      .get(`${this.serverURL}/customers/byRut/`+ this.rutToGetCustomer)
        .then(response => {
          this.$store.dispatch('user/editCustomer', response.data)
          console.log(response.data)

        })
        .catch(e => {
          console.log('error'+e)
        })
    },
    async getCustomers(){
      await axios
          .get(this.serverURL + '/images/pathsWithCustomer')
          .then(response => {
            // mensaje
            //this.customers = response.data
            console.log('customers loaded')
            console.log(response.data)
            response.data.forEach(element => {
              var customer = null
              console.log(element)
              customer = element.customer
              customer.photos = element.paths
              this.customers.push(customer)
            });
          })
          .catch(e => {
            console.log(e, e.response)
            this.file = ''
          })
    },
    async train () {
      const self = this
      self.resetProgress()
      const faces = []
      await Promise.all(self.customers.map(async (customer) => {
        const descriptors = []
        await Promise.all(customer.photos.map(async (photo, index) => {
          const photoId = `${customer.rut}${index}`
          const img = document.getElementById(photoId)
          console.log('img')
          console.log(img)
          const options = {
            detectionsEnabled: true,
            landmarksEnabled: true,
            descriptorsEnabled: true,
            expressionsEnabled: false
          }
          const detections = await self.$store.dispatch('face/getFaceDetections', { canvas: img, options })
          console.log('detections')
        console.log(detections)
          detections.forEach((d) => {
            descriptors.push({
              path: photo,
              descriptor: d.descriptor
            })
          })
          self.increaseProgress()
        }))
        faces.push({
          user: customer.rut,
          descriptors
        })
      }))
      this.faces = faces
      this.loadFaces()
      await self.$store.dispatch('face/save', faces)
        .then(() => {
          self.increaseProgress()
          self.isProgressActive = false
        })
        .catch((e) => {
          self.isProgressActive = false
          console.error(e)
        })
    },
    async loadFaces (){
      console.log(this.faces)
      //this.saveOneFace(this.faces[N])
      this.faces.forEach(face => {
        this.username = face.user
        face.descriptors.forEach(element => {
          let formData = new FormData()
          formData.append('user', this.username)
          formData.append('descriptor', element.descriptor)
          formData.append('path', element.path)
          this.saveDescriptorAwait(formData)
        });
      });
    },
    async saveOneFace(face){
      this.username = face.user
        face.descriptors.forEach(element => {
          let formData = new FormData()
          formData.append('user', this.username)
          formData.append('descriptor', element.descriptor)
          formData.append('path', element.path)
          this.saveDescriptor(formData)
        });
    },
    async saveDescriptorAwait(formData){
      await this.saveDescriptor(formData)
    },
    async saveDescriptor (formData) {
      await axios
        .post(`${this.serverURL}/images/create/withData`, formData)
        .then(response => {
          console.log(response.data)
        })
        .catch(e => {
          console.log('error'+e)
        })
    },
    increaseProgress () {
      const self = this
      self.progress = (100 / self.step) * ++self.counter
    },
    resetProgress () {
      const self = this
      self.progress = self.counter = 0
      self.isProgressActive = true
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