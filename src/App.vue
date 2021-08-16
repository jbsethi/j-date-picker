<template>
  <div id="app">
    <JDatePicker
      v-model="date"
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
        { text: 'cancel', handler: 'cancel', attr: {} },
        { text: 'apply', handler: 'apply', attr: {} },
      ]"
    >
      <button>{{ date.toLocaleString() }}</button>
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
      date: new Date()
    }
  }
}
</script>

