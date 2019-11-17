<script>
  import addSeconds from 'date-fns/addSeconds';
  import { tick, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { POMO_DURATIONS } from './constants';
  import CountdownClock from './components/CountdownClock/CountdownClock.svelte';

  let pomoCycleCompleted = false;
  let cyclesCompletedBeforeLongBreak = 0;
  let pomoCycleType = null;
  let pomoCycleCountdown = null;
  let paused = false;
  let pomodoroCompletedSound;

  function startCycle(cycleType) {
    pomoCycleType = cycleType;
    pomoCycleCompleted = false;
    pomoCycleCountdown = cycleType ? addSeconds(new Date(), POMO_DURATIONS[cycleType]) : null;
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

  onMount(() => Notification.requestPermission());
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
