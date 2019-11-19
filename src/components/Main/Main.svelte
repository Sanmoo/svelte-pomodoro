<script>
  import settings from '../../stores/settings.js';
  import addSeconds from 'date-fns/addSeconds';
  import { tick, onMount, getContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import Settings from '../../components/Settings/Settings.svelte';
  import CountdownClock from '../../components/CountdownClock/CountdownClock.svelte';

  let pomoCycleCompleted = false;
  let cyclesCompletedBeforeLongBreak = 0;
  let pomoCycleType = null;
  let pomoCycleCountdown = null;
  let paused = false;
  let pomodoroCompletedSound;

  function getDurationByCycleType(cycleType) {
    let minutes;
    if (cycleType === 'work') {
      minutes = $settings.workTime;
    } else if (cycleType === 'shortBreak') {
      minutes = $settings.shortBreakTime;
    } else if (cycleType === 'longBreak') {
      minutes = $settings.longBreakTime;
    } else {
      throw new Error('Unknown cycle type');
    }

    return minutes;
    /* return minutes * 60; */
  }

  function requestNotificationPermission() {
    return new Promise((resolve) => {
      if (!("Notification" in window)) {
        alert('This browser does not support notifications');
        return resolve(false);
      } else if (Notification.permission === 'granted') {
        return resolve(true);
      } else if (Notification.permission === 'denied') {
        Notification.requestPermission((permission) => {
          return resolve(permission === "granted");
        });
      }
      return resolve(false);
    });
  }

  async function startCycle(cycleType) {
    if (cycleType === 'work') {
      await requestNotificationPermission();
    }

    pomoCycleType = cycleType;
    pomoCycleCompleted = false;
    pomoCycleCountdown = cycleType ? addSeconds(new Date(), getDurationByCycleType(cycleType)) : null;
    if (pomodoroCompletedSound) {
      pomodoroCompletedSound.pause();
      pomodoroCompletedSound.currentTime = 0;
    }
  }

  function interruptPomodoro() {
    if (confirm('Are you sure?')) {
      startCycle(null);
    }
  }

  function completePomodoro() {
    if (!pomodoroCompletedSound) {
      pomodoroCompletedSound = new Audio('analog-watch-alarm_daniel-simion.mp3');
    }
    pomodoroCompletedSound.play();
    pomoCycleCompleted = true;
    cyclesCompletedBeforeLongBreak += 1;
    if (pomoCycleType === 'work') {
      new Notification('Pomodoro finished');
    } else {
      new Notification('Break finished');
    }
  }

  const { open } = getContext('simple-modal');

  function openSettingsModal() {
    open(Settings);
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
        on:complete={completePomodoro}
        on:updateCountdown={({ detail: { time } }) => pomoCycleCountdown = time}
        pomodoroCountdown={pomoCycleCountdown}
        paused={paused}
      />
      {#if !pomoCycleCountdown || (pomoCycleType !== 'work' && pomoCycleCompleted)}
        <button on:click={() => startCycle('work')}>Start Pomodoro</button>
      {/if}

      {#if !pomoCycleCountdown}
        <button on:click={openSettingsModal}>Open Settings</button>
      {/if}

      {#if pomoCycleCountdown && !paused && !pomoCycleCompleted}
          <button on:click={() => paused = true}>Pause</button>
      {/if}

      {#if pomoCycleCountdown && paused && !pomoCycleCompleted}
        <button on:click={() => paused = false}>Continue</button>
      {/if}

      {#if pomoCycleCountdown && !pomoCycleCompleted}
        <button on:click={interruptPomodoro}>
          Cancel Pomodoro
        </button>
      {/if}

      {#if pomoCycleCountdown && pomoCycleType === 'work' && pomoCycleCompleted}
        <button on:click={() => startCycle('shortBreak')}>
          Start short break
        </button>
      {/if}

      {#if pomoCycleCountdown && pomoCycleType === 'work' && pomoCycleCompleted}
        <button on:click={() => startCycle('longBreak')}>
          Start long break
        </button>
      {/if}

      {#if pomoCycleCountdown && pomoCycleCompleted}
        <button on:click={interruptPomodoro}>
          Stop working
        </button>
      {/if}
    </div>
</div>
