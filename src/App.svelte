<script>
  import addSeconds from 'date-fns/addSeconds';
  import { tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { POMO_DURATIONS } from './constants';
  import CountdownClock from './components/CountdownClock/CountdownClock.svelte';

  let pomoCycleRunning = false;
  let pomoCycleCompleted = false;
  let pomoCycleType = null;
  let pomoCycleCountdown = null;
  let paused = false;

  async function startPomodoro() {
    pomoCycleType = 'work';
    pomoCycleRunning = true;
    pomoCycleCompleted = false;
    pomoCycleCountdown = addSeconds(new Date(), POMO_DURATIONS[pomoCycleType]);
  }

  function interruptPomodoro() {
    if (confirm('Are you sure?')) {
      pomoCycleType = null;
      pomoCycleRunning = false;
      pomoCycleCompleted = false;
      pomoCycleCountdown = null;
    }
  }

  function pausePomodoro() {

  }

  function resumePomodoro() {

  }

  function completePomodoro() {
    const ring = new Audio('analog-watch-alarm_daniel-simion.mp3');
    ring.play();
    pomoCycleCompleted = true;
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
    <div in:fade id="countdown-timer-menu">
      <CountdownClock
        on:complete={completePomodoro}
        on:updateCountdown={({ detail: { time } }) => pomoCycleCountdown = time}
        pomodoroCountdown={pomoCycleCountdown}
        paused={paused}
      />
      {#if !pomoCycleType}
        <button in:fade on:click={startPomodoro}>Iniciar Pomodoro</button>
      {:else if pomoCycleType === 'work'}
        {#if !paused}
          <button on:click={() => paused = true}>Pause</button>
        {:else}
          <button on:click={() => paused = false}>Continue</button>
        {/if}
        <button on:click={interruptPomodoro}>
          Cancel Pomodoro
        </button>
      {/if}
    </div>
</div>
