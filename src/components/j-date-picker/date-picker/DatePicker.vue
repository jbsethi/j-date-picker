<template>
  <div class="j-calendar-box">
    <div class="j-calendar-control">
      <div class="control-back">
        <img @click.stop="changeByFilter(-1)" :src="require('../assets/images/chevron-left.svg')" alt="chevron left" />
      </div>
      <div class="control-main">
        <div @click.stop="$emit('filterChanged', 1)" v-if="filterSelected === 0">{{ month }} {{ calendarStats.year }}</div>
        <div @click.stop="$emit('filterChanged', 2)" v-if="filterSelected === 1">{{ calendarStats.year }}</div>
        <div v-if="filterSelected === 2">{{ calendarStats.year }} - {{ calendarStats.year + 11 }}</div>
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
      <div class="text-light"  @click.stop="clickDate('p', calendarStats.daysInPrevMonth - (calendarStats.daysPaddedBefore - day))" v-for="(day, idx) in calendarStats.daysPaddedBefore" :key="'p' + day + idx + forceRender">
        <div class="day">{{ calendarStats.daysInPrevMonth - (calendarStats.daysPaddedBefore - day) }}</div>
      </div>

      <!-- Days in current month -->
      <div :class="{'active': isDateSelected(day)}" @click.stop="clickDate('c', day)" v-for="(day, idx) in calendarStats.daysInMonth" :key="'c' + day + idx + forceRender">
        <div class="day">{{ day }}</div>
      </div>

      <!-- Days in previous month -->
      <div class="text-light" @click.stop="clickDate('a', day)" v-for="(day, idx) in calendarStats.daysPaddedAfter" :key="'a' + day + idx + forceRender">
        <div class="day">{{ day }}</div>
      </div>
    </div>
    <div v-show="filterSelected === 1" class="j-months">
      <div v-for="(month, idx) in monthNames" :key="month"><div @click="changeMonth(idx - calendarStats.month)">{{ month.substring(0,3) }}</div></div>
    </div>
    <div v-show="filterSelected === 2" class="j-years">
      <div v-for="(year, idx) in 12" :key="'y' + idx" @click="changeYear(calendarStats.year + idx - calendarStats.year)"><div>{{ (calendarStats.year + idx) }}</div></div>
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
    selector: {
      type: Number,
      default: 0
    },
    filterSelected: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      forceRender: 0,
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
      } else if (this.filterSelected === 2) {
        this.changeMutipleYears(status)
      }
    },

    changeMonth(status) {
      const newCalendarDate = new Date(this.calendarStats.year, this.calendarStats.month + status, 1)
      
      if (this.selector === 0) {
        this.populateCalendarStats(newCalendarDate)
        this.$emit('filterChanged', 0)
        this.forceRender++
      } else {
        this.$emit('click:date', (newCalendarDate))
      }
      this.$emit('click:changeMonth', (newCalendarDate))
    },

    changeYear(status) {
      const newCalendarDate = new Date(this.calendarStats.year + status, this.calendarStats.month, 1)

      if (this.selector === 2) {
        this.$emit('click:changeMonth', (newCalendarDate))
      } else {
        this.populateCalendarStats(newCalendarDate)
        this.$emit('filterChanged', 1)
        this.forceRender++
      }
    },

    changeMutipleYears(status) {
      const newCalendarDate = new Date(this.calendarStats.year + (status * 12), this.calendarStats.month, 1)
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

      this.$emit('click:date', (new Date(this.calendarStats.year, month, date)))
    },
    
    isDateSelected(day) {
      const dateTemp = new Date(this.calendarStats.year, this.calendarStats.month, day)

      return isSameDate(this.selectedDate, dateTemp)
    },
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

.j-months, .j-years {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, auto);
  text-align: center;
}

.j-calendar > *, .j-months > *, .j-years > * {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  width: 28px;
  font-weight: 600;
  color: #1d273e;
}

.j-months > *, .j-years > * {
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
</style>