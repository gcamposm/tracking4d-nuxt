<template>
  <no-ssr>
    <v-container >
      <v-layout row wrap>
        <v-flex xs12 sm12 align-center justify-center>
          <v-card class="elevation-12">
            <div>
              <center><h1>Estádisticas Generales</h1></center>
              <div class="grid">
                <br><br><br>
                <ChartBar/>
                <br><br><br>
                <ChartDoughnut/>
                <br><br><br>
                <ChartLine/>
              </div>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </no-ssr>
</template>

<script>
import ChartBar from "@/components/chart-bar";
import ChartDoughnut from "@/components/chart-doughnut";
import ChartLine from "@/components/chart-line";

export default {
  components: {
    ChartBar,
    ChartDoughnut,
    ChartLine
  }
};
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  row-gap: 2rem;
}
</style>