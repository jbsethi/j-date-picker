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
        ref="date-picker"
        :selectedDate="clickedDate || date"
        @click:date="selectDate"
      />
      <date-range-picker v-if="picker === 'date-range'" />

      <div v-if="actions && actions.length > 0" v-bind="actionsAttr">
        <button @click="handleAction(action.handler)" v-for="(action, idx) in actions" :key="action.text + idx" v-bind="action.attr" >{{ action.text }}</button>
      </div>
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
  model: {
    prop: 'date',
    event: 'apply'
  },
  props: {
    date: {
      type: Date,
      default: () => new Date()
    },
    picker: {
      type: String,
      default: 'date',
      validator(value) {
        // The value must match one of these strings
        return ['date', 'date-range'].includes(value)
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

      clickedDate: null,

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

    applySelectedDate() {
      this.togglePicker()
      this.$emit('apply', this.clickedDate)

      this.clickedDate = null
    },

    cancelSelectedDate() {
      this.togglePicker()
      if (!this.options.saveLastState) {
        this.clickedDate = null
        this.$refs['date-picker'].populateCalendarStats(this.date);
      }
    },

    handleAction(handler) {
      if (this.handlers[handler]) {
        this[this.handlers[handler]]()
      } else {
        this.$emit(handler)
      }
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
