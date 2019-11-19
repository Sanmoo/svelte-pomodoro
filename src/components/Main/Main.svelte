<script>
  import settings from '../../stores/settings.js'
  import addSeconds from 'date-fns/addSeconds'
  import differenceInSeconds from 'date-fns/differenceInSeconds'
  import { tick, onMount, getContext } from 'svelte'
  import { fade } from 'svelte/transition'
  import Settings from '../Settings/Settings.svelte'
  import CountdownClock from '../CountdownClock/CountdownClock.svelte'
  import Stopwatch from '../Stopwatch/Stopwatch.svelte'

  let pomoCycleCompleted = false
  let pomoCycleType = null
  let pomoCycleCountdown = null
  let paused = false
  let cummulatedWorkTimeInDynamicPomodoroInSecs = 0
  let currentWorkTimeInDynamicPomodoroInSecs = null
  let cummulatedBreakTimeInDynamicPomodoroInSecs = 0
  let pomodoroCompletedSound
  let dynamicPomoCycleStartingPoint = null

  function getDurationByCycleType(cycleType) {
    if ($settings.enableDynamicPomos) {
      let pauseInSecs = Math.floor(currentWorkTimeInDynamicPomodoroInSecs / 12)
      if (cycleType === 'shortBreak') {
        cummulatedBreakTimeInDynamicPomodoroInSecs += pauseInSecs
      } else if (cycleType === 'longBreak') {
        cummulatedBreakTimeInDynamicPomodoroInSecs += pauseInSecs
        pauseInSecs = cummulatedBreakTimeInDynamicPomodoroInSecs
        cummulatedBreakTimeInDynamicPomodoroInSecs = 0
        cummulatedWorkTimeInDynamicPomodoroInSecs = 0
      } else {
        throw new Error(
          `Cycle type ${cycleType} is not supported in dynamic pomodoros.`
        )
      }

      return pauseInSecs
    }

    let minutes

    if (cycleType === 'work') {
      minutes = $settings.workTime
    } else if (cycleType === 'shortBreak') {
      minutes = $settings.shortBreakTime
    } else if (cycleType === 'longBreak') {
      minutes = $settings.longBreakTime
    } else {
      throw new Error('Unknown cycle type')
    }

    return minutes * 60
  }

  function requestNotificationPermission() {
    return new Promise(resolve => {
      if (!('Notification' in window)) {
        alert('This browser does not support notifications')
        return resolve(false)
      } else if (Notification.permission === 'granted') {
        return resolve(true)
      } else if (Notification.permission === 'denied') {
        Notification.requestPermission(permission => {
          return resolve(permission === 'granted')
        })
      }
      return resolve(false)
    })
  }

  async function startCycle(cycleType) {
    if (cycleType === 'work') {
      await requestNotificationPermission()
    }

    pomoCycleType = cycleType
    pomoCycleCompleted = false
    if ($settings.enableDynamicPomos && cycleType === 'work') {
      dynamicPomoCycleStartingPoint = new Date()
      pomoCycleCountdown = null
    } else {
      pomoCycleCountdown = cycleType
        ? addSeconds(new Date(), getDurationByCycleType(cycleType))
        : null
      dynamicPomoCycleStartingPoint = null
    }
    if (pomodoroCompletedSound) {
      pomodoroCompletedSound.pause()
      pomodoroCompletedSound.currentTime = 0
    }

    if (cycleType == null) {
      cummulatedWorkTimeInDynamicPomodoroInSecs = 0
      cummulatedBreakTimeInDynamicPomodoroInSecs = 0
    }
  }

  function interruptPomodoro() {
    if (confirm('Are you sure?')) {
      startCycle(null)
    }
  }

  function completeTraditionalPomodoro() {
    if (!pomodoroCompletedSound) {
      pomodoroCompletedSound = new Audio('analog-watch-alarm_daniel-simion.mp3')
    }
    pomodoroCompletedSound.play()
    pomoCycleCompleted = true
    if (pomoCycleType === 'work') {
      new Notification('Pomodoro finished')
    } else {
      new Notification('Break finished')
    }
  }

  function completeDynamicWorkingPomodoro(breakCycleType) {
    pomoCycleCompleted = true
    currentWorkTimeInDynamicPomodoroInSecs = differenceInSeconds(
      new Date(),
      dynamicPomoCycleStartingPoint
    )
    cummulatedWorkTimeInDynamicPomodoroInSecs += currentWorkTimeInDynamicPomodoroInSecs
    dynamicPomoCycleStartingPoint = null
    startCycle(breakCycleType)
  }

  const { open } = getContext('simple-modal')

  function openSettingsModal() {
    open(Settings)
  }
</script>

<style>
  h1 {
    color: purple;
  }

  .app-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  #countdown-timer-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #countdown-timer-menu button {
    margin-top: 0.8em;
  }
</style>

<div class="app-wrapper">
  <div id="countdown-timer-menu">
    <CountdownClock
      on:complete={completeTraditionalPomodoro}
      on:updateCountdown={({ detail: { time } }) => (pomoCycleCountdown = time)}
      pomodoroCountdown={pomoCycleCountdown}
      {paused} />
    <Stopwatch
      startTime={dynamicPomoCycleStartingPoint}
      {paused}
      on:updateStartTime={({ detail: { time } }) => (dynamicPomoCycleStartingPoint = time)} />
    {#if (!pomoCycleCountdown && !dynamicPomoCycleStartingPoint) || (pomoCycleType !== 'work' && pomoCycleCompleted)}
      <button on:click={() => startCycle('work')}>Start Pomodoro</button>
    {/if}

    {#if !pomoCycleCountdown && !dynamicPomoCycleStartingPoint}
      <button on:click={openSettingsModal}>Open Settings</button>
    {/if}

    {#if (pomoCycleCountdown || dynamicPomoCycleStartingPoint) && !paused && !pomoCycleCompleted}
      <button on:click={() => (paused = true)}>Pause</button>
    {/if}

    {#if (pomoCycleCountdown || dynamicPomoCycleStartingPoint) && paused && !pomoCycleCompleted}
      <button on:click={() => (paused = false)}>Continue</button>
    {/if}

    {#if (pomoCycleCountdown || dynamicPomoCycleStartingPoint) && !pomoCycleCompleted}
      <button on:click={interruptPomodoro}>Cancel Pomodoro</button>
    {/if}

    {#if pomoCycleCountdown && pomoCycleType === 'work' && pomoCycleCompleted}
      <button on:click={() => startCycle('shortBreak')}>
        Start short break
      </button>
    {/if}

    {#if pomoCycleCountdown && pomoCycleType === 'work' && pomoCycleCompleted}
      <button on:click={() => startCycle('longBreak')}>Start long break</button>
    {/if}

    {#if pomoCycleCountdown && pomoCycleCompleted}
      <button on:click={interruptPomodoro}>Stop working</button>
    {/if}

    {#if dynamicPomoCycleStartingPoint && !pomoCycleCompleted && pomoCycleType === 'work'}
      <button on:click={() => completeDynamicWorkingPomodoro('shortBreak')}>
        Complete Work and Make a Short Break
      </button>

      <button on:click={() => completeDynamicWorkingPomodoro('longBreak')}>
        Complete Work and Make a Long Break
      </button>
    {/if}
  </div>
</div>
