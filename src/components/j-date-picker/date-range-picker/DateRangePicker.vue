<template>
  <div>
    <div class="j-range-header"></div>
    <div class="j-range-calendar">
      <div>
        <date-picker isStart :selectDateRange="clickedDateRange" @click:date="selectDate"/>
      </div>
      <div>
        <date-picker :selectDateRange="clickedDateRange" @click:date="selectDate"/>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from './DatePicker.vue'
export default {
  components: { DatePicker },
  name: 'date-range-picker',
  data() {
    return {
      clickedDateRange: [],
    }
  },
  computed: {
  },
  methods: {
    selectDate(clickedDate) {
      if (this.clickedDateRange.length === 2) {
        this.clickedDateRange = []
      }
      
      this.clickedDateRange.push(clickedDate)
    },
  }
}
</script>

<style scoped>
.j-range-calendar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
