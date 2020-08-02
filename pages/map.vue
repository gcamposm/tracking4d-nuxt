<template>
    <v-container >
      <v-layout row wrap>
        <v-flex xs12 sm12 align-center justify-center>
          <v-card class="elevation-12">
            <div>
              <br><br>
              <center><h1>Mapa de Calor</h1></center>
              <br><br>
              <div class="grid">
                <center>
                  <div id="plano" class="tab-pane pt-6 fade in active">
                    <img src="@/assets/img/plano.jpg" alt="" class="plano">
                    <img src="@/assets/img/camera.png" alt="" class="camera_1">
                    <div class="camera_01_div" id="camera_01_div"> </div>
                    <img src="@/assets/img/camera.png" alt="" class="camera_2">
                    <div class="camera_02_div" id="camera_02_div"> </div>
                  </div>
                </center>
              </div>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
export default {
  data () {
    return {
      posts: null
    }
  },
  async created (){
    console.log('holi');
    return this.$router.push({ path: '/map' })
  }
}
</script>

<style type="text/css">
  .camera_1{
  position: absolute;
  top: 72%;
  left:53%;
  width: 30px;
  height: 30px;
}

.camera_01_div{
  position: absolute;
  border: #117cc1 1px dashed;
  top: 73%;
  left:33%;
  width: 20%;
  height: 15%;
}

.camera_2{
  position: absolute;
  top: 52%;
  left:78%;
  width: 30px;
  height: 30px;
}

.camera_02_div{
  position: absolute;
  border: #c11111 1px dashed;
  top: 52%;
  left:60%;
  width: 18%;
  height: 40%;
}

.persona{
  width: 5px;
  height: 5px;
  border-radius: 25%;
  position:absolute;
  cursor:pointer;
}

.plano{
  width: 75%;
  height: 100%;
}


.panel-heading {
  background-color: #ddd !important;
  font-weight: bold;
}

.panel-body {
  padding: 10px 15px !important;
}

.nowrap {
  white-space: nowrap;
}

.w0 {
  width: 3%;
}

.tab-pane {
  min-height: 350px;
}

.chart-content {
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 10px 0px;
  padding: 10px;
  min-height: 300px;
}

/** Loader **/
.loader {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  position: relative;
  margin: 0 auto;
}

#loader-1:before,
#loader-1:after {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: 10px solid transparent;
  border-top-color: #3498db;
}

#loader-1:before {
  z-index: 100;
  animation: spin 1s infinite;
}

#loader-1:after {
  border: 10px solid #ccc;
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
/** Loader **/

.navbar {
  padding-top: 6px;
  min-height: 60px;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.6);
  border: 1px solid #117cc1;
}

.navbar .navbar-brand {
  color: #fff;
}

.navbar,
.navbar-collapse {
  background-color: #117cc1 !important;
  color: #fff;
}

.navbar-default .navbar-nav > li > a {
  color: #fff;
}

.navbar .navbar-brand:hover,
.navbar .navbar-brand:focus,
.navbar-default .navbar-nav > li > a:hover,
.navbar-default .navbar-nav > li > a:focus {
  color: #eee;
}

.navbar .btn-default,
.navbar .btn-default:hover,
.navbar .btn-default:focus,
.navbar .btn-default:active {
  background-color: #08273c;
  border-color: #08273c;
  color: #fff;
  font-weight: bold;
}

.p-0 {
  padding: 0px !important;
}

.pt-6 {
  padding-top: 6px !important;
}

.pb-6 {
  padding-top: 6px !important;
}

.cursor-pointer {
  cursor: pointer;
}
.client-square {
  border: 1px solid #333;
  height: 15px;
  width: 15px;
}
</style>