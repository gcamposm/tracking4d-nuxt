<template>
  <div class="card">
    <div class="card-body">
      <h2 class="card-title">Gráfico lineal - Visitas totales</h2>
      <br>
      <div class="btn-group btn-group-toggle">
        <label
          v-for="(item, index) in btn"
          :key="index"
          :class="{ active: item.value == radio }"
          class="btn btn-success"
        >
          <input
            v-model="radio"
            :name="dataLabel"
            :value="item.value"
            type="radio"
          />
          {{ item.label }}
        </label>
      </div>
    </div>

    <div class="card-img-bottom">
      <chartjs-line
        :backgroundcolor="bgColor"
        :beginzero="beginZero"
        :bind="true"
        :bordercolor="borderColor"
        :data="data[radio]"
        :datalabel="dataLabel"
        :labels="labels[radio]"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgColor: "#81894e",
      beginZero: true,
      borderColor: "#81894e",
      btn: [
        { label: "Hoy", value: "day" },
        { label: "Esta semana", value: "week" }
      ],
      data: {
        day: [1, 3, 5, 3, 1],
        week: [12, 14, 16, 18, 11, 13, 15]
      },
      dataLabel: "Visitas",
      labels: {
        day: [8, 10, 12, 14, 16],
        week: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"]
      },
      radio: "day"
    };
  }
};
</script>