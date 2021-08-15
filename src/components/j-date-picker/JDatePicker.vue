<template>
  <div ref="JCalendarContainer" class="j-date-picker">
    <div ref="clickContainer" class="j-control-button" @click="togglePicker">
      <slot />
    </div>
    <div
      v-show="show"
      ref="dropdownContainer"
      class="j-picker-dropdown"
      :style="{
        top: (topPosition + 5) + 'px'
      }"
    >
      <date-picker
        v-if="picker === 'date'"
        :selectedDate="clickedDate"
        @click:date="selectDate"
      />
      <date-range-picker v-if="picker === 'date-range'" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'JDatePicker',
  components: {
    'date-picker': () => import('./date-picker/DatePicker.vue'),
    'date-range-picker': () => import('./date-range-picker/DateRangePicker.vue')
  },
  props: {
    picker: {
      type: String,
      default: 'date',
      validator(value) {
        // The value must match one of these strings
        return ['date', 'date-range'].includes(value)
      }
    },
    
  },
  data () {
    return {
      show: false,
      topPosition: 0,

      clickedDate: null
    }
  },
  mounted () {
    document.addEventListener('click', this.clickEventHandler.bind(this))
  },
  beforeUnmount () {
    document.removeEventListener('click', this.clickEventHandler.bind(this))
  },
  methods: {
    togglePicker () {
      console.log('is it closed from here')
      this.show = !this.show

      if (this.show) this.topPosition = this.$slots?.["default"]?.[0]?.elm?.offsetHeight || 0
    },

    clickEventHandler (e) {
      console.log(this.$refs.JCalendarContainer.contains(e.target))
      if (this.show) {
        if (!this.$refs.clickContainer.contains(e.target)) {
          if (!this.$refs.dropdownContainer.contains(e.target)) {
            this.togglePicker()
          }
        }
      }
    },

    selectDate(clickedDate) {
      this.clickedDate = clickedDate
    }
  }
}
</script>

<style scoped>
.j-date-picker {
  position: relative;
  display: inline-block;
}

.j-control-button, .j-picker-dropdown {
  display: inline-flex;
}

.j-picker-dropdown {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
