<template>
  <div class="j-calendar-box">
    <div class="j-calendar-control">
      <div class="control-back">
        <img @click.stop="changeByFilter(-1)" :src="require('../assets/images/chevron-left.svg')" alt="chevron left" />
      </div>
      <div class="control-main">
        <div @click="filterSelected = 1" v-if="filterSelected === 0">{{ month }} {{ calendarStats.year }}</div>
        <div @click="filterSelected = 0" v-if="filterSelected === 1">{{ calendarStats.year }}</div>
      </div>
      <div class="control-forward">
        <img @click.stop="changeByFilter(+1)" :src="require('../assets/images/chevron-right.svg')" alt="chevron right" />
      </div>
    </div>

    <div v-show="filterSelected === 0" class="j-calendar">
      <div class="text-light" v-for="(day, idx) in weekDays" :key="day + idx">
        <div>{{ day }}</div>
      </div>

      <!-- Days in previous month -->
      <div class="text-light" :class="{'highlight': isDateInBetweenRange(calendarStats.daysInPrevMonth - (calendarStats.daysPaddedBefore - day), -1)}" @click.stop="clickDate('p', calendarStats.daysInPrevMonth - (calendarStats.daysPaddedBefore - day))" v-for="(day, idx) in calendarStats.daysPaddedBefore" :key="'p' + day + idx + forceRender">
        <div class="day">{{ calendarStats.daysInPrevMonth - (calendarStats.daysPaddedBefore - day) }}</div>
      </div>

      <!-- Days in current month -->
      <div :class="{'active': isDateSelected(day), 'highlight': isDateInBetweenRange(day)}" @click.stop="clickDate('c', day)" v-for="(day, idx) in calendarStats.daysInMonth" :key="'c' + day + idx + forceRender">
        <div class="day">{{ day }}</div>
      </div>

      <!-- Days in previous month -->
      <div class="text-light" :class="{'highlight': isDateInBetweenRange(day, +1)}" @click.stop="clickDate('a', day)" v-for="(day, idx) in calendarStats.daysPaddedAfter" :key="'a' + day + idx + forceRender">
        <div class="day">{{ day }}</div>
      </div>
    </div>
    <div v-show="filterSelected === 1" class="j-months">
      <div v-for="(month, idx) in monthNames" :key="month"><div @click="changeMonth(idx - calendarStats.month)">{{ month.substring(0,3) }}</div></div>
    </div>
  </div>
</template>

<script>
import { daysInMonth, firstDayOfMonth, isSameDate } from '../utils/utils'
export default {
  name: 'date-picker',
  props: {
    selectedDate: {
      type: Date,
      default: null
    },
    selectDateRange: {
      type: Array,
      default: () => []
    },
    isStart: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      forceRender: 0,
      filterSelected: 0,
      weekDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      currentDate: new Date(),
      calendarStats: {
        month: null,
        year: null,
        daysInMonth: 0,
        daysInPrevMonth: 0,
        startingDay: null,
        daysPaddedBefore: 0,
        daysPaddedAfter: 0
      },
    }
  },

  computed: {
    month () {
      return this.monthNames[this.calendarStats.month]
    }
  },

  watch: {
    selectedDate: {
      immediate: true,
      handler (selectDate) {
        this.populateCalendarStats(selectDate ? selectDate : this.currentDate)
        this.forceRender++
      }
    },
    selectDateRange: {
      immediate: true,
      deep: true,
      handler (selectDateRange) {
        const range = selectDateRange.filter(dateRangeObj => dateRangeObj.start === this.isStart)

        if (!this.isStart && selectDateRange.length === 0) {
          this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
        }

        this.populateCalendarStats(range?.[0] ? range?.[0].date : this.currentDate)
        this.forceRender++
      }
    },
  },

  methods: {
    populateCalendarStats(initDate) {
      const month = this.calendarStats.month = initDate.getMonth()
      const year = this.calendarStats.year = initDate.getFullYear()

      const noDaysInMonth = this.calendarStats.daysInMonth = daysInMonth(year, month + 1)
      this.calendarStats.daysInPrevMonth = daysInMonth(year, month)

      const startingDay = this.calendarStats.startingDay = firstDayOfMonth(year, month)

      const daysPaddedBefore = this.calendarStats.daysPaddedBefore = startingDay.getDay() === 1 ? 0 : 6 - startingDay.getDay()
      const daysPaddedAfter = this.calendarStats.daysPaddedAfter = (7 - ((noDaysInMonth + daysPaddedBefore) % 7))

      if ((daysPaddedBefore + daysPaddedAfter) <= 7) {
        this.calendarStats.daysPaddedAfter = daysPaddedAfter + 7
      }
    },

    changeByFilter (status) {
      if (this.filterSelected === 0) {
        this.changeMonth(status)
      } else if (this.filterSelected === 1) {
        this.changeYear(status)
      }
    },

    changeMonth(status) {
      const newCalendarDate = new Date(this.calendarStats.year, this.calendarStats.month + status, 1)
      this.populateCalendarStats(newCalendarDate)

      this.filterSelected = 0
      this.forceRender++
      this.$emit('click:changeMonth', (newCalendarDate))
    },

    changeYear(status) {
      const newCalendarDate = new Date(this.calendarStats.year + status, this.calendarStats.month, 1)
      this.populateCalendarStats(newCalendarDate)
    },

    clickDate (dateInMonth, date) {
      let month = this.calendarStats.month

      switch (dateInMonth) {
        case 'p':
          month = month - 1
          break;
        case 'a':
          month = month + 1
          break;
      }

      this.$emit('click:date', ({ date: new Date(this.calendarStats.year, month, date), start: this.isStart }))
    },

    isDateSelected(day) {
      const dateTemp = new Date(this.calendarStats.year, this.calendarStats.month, day)

      const sameDay = this.selectDateRange.find(dateObj => {
        if (isSameDate(dateObj.date, dateTemp)) {
          return true
        }

        return false
      })

      return !!sameDay
    },

    isDateInBetweenRange(day, changeMonth = 0) {
      if (this.selectDateRange.length === 2) {
        const current = new Date(this.calendarStats.year, this.calendarStats.month + changeMonth, day).getTime()
        const date1 = this.selectDateRange[0].date.getTime()
        const date2 = this.selectDateRange[1].date.getTime()


        if (date1 < date2) {
          if (date1 < current && current < date2) {
            return true
          }
        } else {
          if (date2 < current && current < date1) return true
        }

        return false
      }

      return false
    }
  }
}
</script>

<style scoped>
.j-calendar-box {
  width: 196px;
}

.j-calendar-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.j-calendar-control .control-back,
.j-calendar-control .control-forward {
  height: 28px;
  width: 28px;
}

.j-calendar-control > * {
  display: flex;
  justify-content: center;
  align-items: center;
}

.j-calendar {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, auto);
  text-align: center;
}

.j-months {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, auto);
  text-align: center;
}

.j-calendar > *, .j-months > * {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  width: 28px;
  font-weight: 600;
  color: #1d273e;
}

.j-months > * {
  width: 100%;
  height: 49px;
}


.j-calendar .day {
  cursor: pointer;
  height: 20px;
  width: 20px;
  border-radius: 50%;
}

.j-calendar .text-light {
  color: #777;
}


.highlight, .active {
  background-color: #267c2ef9;
}

.active > div {
  background-color: #267c2e;
}
</style>