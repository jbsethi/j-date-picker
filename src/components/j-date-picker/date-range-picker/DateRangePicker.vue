<template>
  <div>
    <div class="j-range-header"></div>
    <div class="j-range-calendar">
      <div>
        <date-picker
          isStart
          :rangeIsSameMonth="rangeIsSameMonth"
          :selectDateRange="clickedDateRange.length ? clickedDateRange : selectedRange"
          @click:date="selectDate"
        />
      </div>
      <div>
        <date-picker
          :rangeIsSameMonth="rangeIsSameMonth"
          :selectDateRange="clickedDateRange.length ? clickedDateRange : selectedRange"
          @click:date="selectDate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from './DatePicker.vue'

import { dateDiffInDays, isSameMonth } from '../utils/utils'
export default {
  components: { DatePicker },
  name: 'date-range-picker',
  props: {
    selectedRange: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      clickedDateRange: [],
      rangeIsSameMonth: true,
    }
  },
  computed: {
  },

  watch: {
    selectedRange: {
      immediate: true,
      deep: true,
      handler(range) {
        if (range.length === 2) {
          if (isSameMonth(range[0].date, range[1].date)) {
            this.rangeIsSameMonth = true
          } else {
            this.rangeIsSameMonth = false
          }
        }
      }
    }
  },
  
  methods: {
    selectDate(clickedDate) {
      if (this.clickedDateRange.length === 2) {
        this.clickedDateRange = [clickedDate]

      } else if (this.clickedDateRange.length === 1) {
        const datetempObj = this.clickedDateRange[0]

        if (dateDiffInDays(datetempObj.date, clickedDate.date) < 0) {
          this.clickedDateRange.unshift(clickedDate)
        } else {
          this.clickedDateRange.push(clickedDate)
        }

        this.$emit('range:selected', this.clickedDateRange)
      } else {
        this.clickedDateRange.push(clickedDate)
      }
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
