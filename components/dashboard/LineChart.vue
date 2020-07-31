<script>
import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: {
    label: {
      type: String
    },
    chartData: {
      type: Array
    },
    options: {
      type: Object
    },
    chartColors: {
      type: Object
    }
  },
  mounted () {
    this.renderChart({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [{
        label: 'Reconocidos',
        data: [2, 30, 10, 40, 40, 11, 34, 49, 22, 19, 10, 11],
        borderColor: '#e63838',
        backgroundColor: '#e63838'
      },
      {
        label: 'Anónimos',
        data: [12, 35, 15, 45, 60, 31, 134, 59, 32, 29, 10, 11],
        borderColor: '#1030cf',
        backgroundColor: '#38b6e6'
      },
      {
        label: this.label,
        data: [22, 40, 20, 30, 80, 111, 234, 49, 12, 39, 102, 111],
        borderColor: '#077187',
        backgroundColor: '#74A57F'
      }
      ]
    }, this.options)
  }
}
</script>
