<script>
  import ProgressBar from 'progressbar.js'
  import { tick, createEventDispatcher } from 'svelte'
  import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
  import isBefore from 'date-fns/isBefore'
  import addMilliseconds from 'date-fns/addMilliseconds'
  import { formatRemainingTime } from './utils'

  export let pomodoroCountdown
  export let paused

  const dispatch = createEventDispatcher()
  let bar
  let updateCronometerInterval
  let lastPausedStatus = {
    time: null,
    lastCountdownTime: null,
  }

  function updatePausedState(paused) {
    const now = new Date()
    if (
      paused &&
      pomodoroCountdown &&
      isBefore(now, pomodoroCountdown) &&
      !lastPausedStatus.time
    ) {
      pauseCountdown()
    }

    if (!paused && lastPausedStatus.time) {
      const difference = differenceInMilliseconds(
        new Date(),
        lastPausedStatus.time
      )
      const updatedCountdown = addMilliseconds(
        lastPausedStatus.lastCountdownTime,
        difference
      )
      dispatch('updateCountdown', { time: updatedCountdown })
    }
  }

  async function setupCountdown(countdownTime) {
    const isComingBackFromPausedState = lastPausedStatus.time
    if (isComingBackFromPausedState) {
      lastPausedStatus.time = null
      lastPausedStatus.lastCountdownTime = null
    }

    if (!isComingBackFromPausedState) {
      stopCountdown()
    }

    if (!countdownTime) {
      return
    }

    await tick()

    const duration = differenceInMilliseconds(countdownTime, new Date())
    if (!isComingBackFromPausedState) {
      bar = new ProgressBar.Circle('#countdown-timer-surround', {
        color: 'blue',
        strokeWidth: 4,
        trailWidth: 1,
      })
    }
    bar.animate(1, { duration }, () => dispatch('complete'))
    updateCronometerInterval = setInterval(() => {
      bar.setText(formatRemainingTime(countdownTime))
    }, 50)
  }

  function stopCountdown() {
    if (updateCronometerInterval) {
      clearInterval(updateCronometerInterval)
      updateCronometerInterval = null
    }
    if (bar) {
      bar.destroy()
      bar = null
    }
  }

  function pauseCountdown() {
    if (bar) {
      bar.stop()
    }

    if (updateCronometerInterval) {
      lastPausedStatus.time = new Date()
      lastPausedStatus.lastCountdownTime = pomodoroCountdown
      clearInterval(updateCronometerInterval)
      updateCronometerInterval = null
    }
  }

  $: setupCountdown(pomodoroCountdown)
  $: updatePausedState(paused)
</script>

<style>
  #countdown-timer-surround {
    height: 200px;
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4em;
  }

  #countdown-timer-surround.hidden {
    display: none;
  }
</style>

<div id="countdown-timer-surround" class:hidden={!pomodoroCountdown} />
