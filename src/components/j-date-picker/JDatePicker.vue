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
        v-if="['date', 'month'].includes(picker)"
        :selector="selector"
        :filterSelected="filterSelected"
        ref="date-picker"
        :selectedDate="clickedDate || date"
        @click:date="selectDate"
        @filterChanged="filterAppliedDatePicker"
      />

      <date-range-picker
        :key="show"
        v-if="picker === 'date-range'"
        ref="date-range-picker"
        :selectedRange="clickedRange.length ? clickedRange : selectedRange"
        @range:selected="selectRange"
      />

      <div v-if="actions && actions.length > 0 && filterSelected === selector" v-bind="actionsAttr">
        <button @click="handleAction(action.handler)" v-for="(action, idx) in actions" :key="action.text + idx" v-bind="action.attr" >{{ action.text }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { isSameMonth } from './utils/utils'
export default {
  name: 'JDatePicker',
  components: {
    'date-picker': () => import('./date-picker/DatePicker.vue'),
    'date-range-picker': () => import('./date-range-picker/DateRangePicker.vue')
  },
  model: {
    prop: 'date',
    event: 'apply'
  },
  props: {
    date: {
      type: [Date, Object],
      default: () => ({
          start: new Date(),
          end: new Date(new Date().getDate() + 7)
        })
    },
    picker: {
      type: String,
      default: 'date',
      validator(value) {
        // The value must match one of these strings
        return ['date', 'month', 'date-range'].includes(value)
      }
    },
    options: {
      type: Object,
      default: () => {
        return {
          saveLastState: false
        }
      }
    },
    actionsAttr: {
      type: Object,
      default: null
    },
    actions: {
      type: Array,
      default: null,
      validator(value) {
        const invalidItem = value.findIndex(act => {
          if (
            typeof act.text === 'string' &&
            typeof act.handler === 'string' &&
            act.text.length > 0 &&
            act.handler.length > 0
          ) {
            return false
          } else {
            return true
          }
        })

        return invalidItem === -1 ? true : false
      }
    },
  },
  data () {
    return {
      show: false,
      topPosition: 0,
      selectedRange: [],

      clickedDate: null,
      clickedRange: [],
      selector: 0,
      filterSelected: 0,

      handlers: {
        'apply': 'applySelectedDate',
        'cancel': 'cancelSelectedDate'
      }
    }
  },
  mounted () {
    document.addEventListener('click', this.clickEventHandler.bind(this))
  },
  beforeUnmount () {
    document.removeEventListener('click', this.clickEventHandler.bind(this))
  },

  watch: {
    picker: {
      immediate: true,
      handler(value) {
        if (value === 'date') {
          this.selector = 0
        } else if (value === 'month') {
          this.selector = 1
        } else {
          this.selector = -1
        }
      }
    },

    selector: {
      immediate: true,
      handler(value) {
        this.filterSelected = value
      }
    },

    date: {
      immediate: true,
      deep: true,
      handler(value) {
        if (this.picker === 'date-range') {
          if (value?.start && value?.end) {
            const isSame = isSameMonth(value.start, value.end)
            this.selectedRange = [
              { date: value.start, start: true },
              { date: value.end, start: isSame },
            ]
          } else {
            let startDate = new Date()
            let endDate = new Date()
            endDate.setDate(endDate.getDate() + 6)

            const isSame = isSameMonth(startDate, endDate)
            this.selectedRange = this.clickedRange = [
              { date: new Date(), start: true },
              { date: endDate, start: isSame },
            ]

            this.$emit('apply', { start: startDate, end: endDate })
          }
        }
      }
    }
  },

  methods: {
    togglePicker () {
      this.show = !this.show

      if (this.show) this.topPosition = this.$slots?.["default"]?.[0]?.elm?.offsetHeight || 0
    },

    clickEventHandler (e) {
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
    },

    selectRange (clickedRange) {
      this.clickedRange = clickedRange
    },

    applySelectedDate() {
      this.togglePicker()

      if (this.selector === -1) {
        this.$emit('apply', this.clickedRange.length == 2 ? { start: this.clickedRange[0].date, end: this.clickedRange[1].date }  : this.date)
      } else {
        this.$emit('apply', this.clickedDate || this.date)

        if (!this.options.saveLastState) {
          this.$refs['date-picker'].populateCalendarStats(this.clickedDate || this.date);
        }
      }

      this.clickedDate = null
      this.clickedRange= []
    },

    cancelSelectedDate() {
      this.togglePicker()
      if (!this.options.saveLastState) {
        this.clickedDate = null
        if (this.selector === -1) {
          this.clickedRange = []
        } else {
          this.$refs['date-picker'].populateCalendarStats(this.date);
        }
      }
    },

    handleAction(handler) {
      if (this.handlers[handler]) {
        this[this.handlers[handler]]()
      } else {
        this.$emit(handler)
      }
    },

    filterAppliedDatePicker(filterApplied) {
      this.filterSelected = filterApplied
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
  display: flex;
  flex-direction: column;
}
</style>
