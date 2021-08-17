<template>
  <div id="app">
    <JDatePicker
      v-model="date"
      picker="date-range"
      :options="{
        saveLastState: false
      }"
      :actionsAttr="{
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '5px'
        }
      }"
      :actions="[
        { text: 'cancel', handler: 'cancel', attr: {
          class: 'w-full',
          style: {
            backgroundColor: 'green'
          }
        } },
        { text: 'apply', handler: 'apply', attr: {} },
      ]"
    >
      <button>{{ date }}</button>
    </JDatePicker>
  </div>
</template>

<script>
import JDatePicker from './components/j-date-picker/JDatePicker.vue'
export default {
  name: 'App',
  components: {
    JDatePicker
  },
  data() {
    return {
      date: null
    }
  }
}
</script>

