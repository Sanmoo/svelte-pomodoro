<script>
  import { onMount, onDestroy } from 'svelte'
  import { formatTimeDifference } from '../../utils/time_format.js'
  import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
  import subMilliseconds from 'date-fns/subMilliseconds'
  export let startTime
  export let paused
  let chronometerText = ''
  let updatingChronometerTextInterval
  let lastPausedStatus = { differenceInMilliseconds: null }

  function updatePausedState(paused) {
    const now = new Date()
    if (
      paused &&
      startTime &&
      isBefore(now, pomodoroCountdown) &&
      !lastPausedStatus.time
    ) {
      lastPausedStatus.differenceInMilliseconds = differenceInMilliseconds(
        new Date(),
        startTime
      )
    }

    if (!paused && lastPausedStatus.differenceInMilliseconds) {
      const updatedStartTime = subMilliseconds(
        new Date(),
        lastPausedStatus.differenceInMilliseconds
      )
      lastPausedStatus.differenceInMilliseconds = null
      dispatch('updateStartTime', { time: updatedStartTime })
    }
  }

  onMount(() => {
    updatingChronometerTextInterval = setInterval(() => {
      if (paused) {
        return
      }

      if (startTime) {
        chronometerText = formatTimeDifference(startTime, new Date())
      } else {
        chronometerText = ''
      }
    }, 100)
  })

  onDestroy(() => {
    clearInterval(updatingChronometerTextInterval)
  })
</script>

<style>
  #stopwatch-surround {
    height: 200px;
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4em;
    position: relative;
  }

  #stopwatch-surround.hidden {
    display: none;
  }

  div.stopwatch-text {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 0px;
    margin: 0px;
    transform: translate(-50%, -50%);
    color: blue;
  }

  svg {
    display: block;
    width: 100%;
  }
</style>

<div id="stopwatch-surround" class:hidden={!startTime}>
  <svg viewBox="0 0 100 100">
    <path
      d="M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96"
      stroke="#ccc"
      stroke-width="1.5"
      fill-opacity="0" />
  </svg>
  <div class="stopwatch-text">{chronometerText}</div>
</div>
