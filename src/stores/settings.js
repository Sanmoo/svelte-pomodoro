import { writable } from 'svelte/store'

const settingsFromLocalStorage = JSON.parse(
  localStorage.getItem('settings') || '{}'
)

export const settings = writable({
  workTime: settingsFromLocalStorage.workTime || 25,
  shortBreakTime: settingsFromLocalStorage.shortBreakTime || 5,
  longBreakTime: settingsFromLocalStorage.longBreakTime || 20,
  enableDynamicPomos: settingsFromLocalStorage.enableDynamicPomos || false,
})

settings.subscribe(update =>
  localStorage.setItem('settings', JSON.stringify(update))
)

export default settings
