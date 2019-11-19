<script>
  import settings from '../../stores/settings.js'
</script>

<style>
  div.form-field-group {
    display: flex;
    justify-content: space-between;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  div.dynamic-options {
    margin-top: 1em;
  }
</style>

<div>
  <h2>Your Settings</h2>
  <form>
    <div class="traditional-options">
      <div class="form-field-group">
        <label for="workTime">Work Duration</label>
        <div class="form-field-input">
          <span>{$settings.workTime} min</span>
          <input
            type="range"
            bind:value={$settings.workTime}
            name="workTime"
            disabled={$settings.enableDynamicPomos}
            min="25"
            max="120" />
        </div>
      </div>
      <div class="form-field-group">
        <label for="shortBreakTime">Short Break Duration</label>
        <div class="form-field-input">
          <span>{$settings.shortBreakTime} min</span>
          <input
            type="range"
            bind:value={$settings.shortBreakTime}
            name="shortBreakTime"
            disabled={$settings.enableDynamicPomos}
            min="5"
            max="24" />
        </div>
      </div>
      <div class="form-field-group">
        <label for="longBreakTime">Long Break Duration</label>
        <div class="form-field-input">
          <span>{$settings.longBreakTime} min</span>
          <input
            type="range"
            bind:value={$settings.longBreakTime}
            name="longBreakTime"
            disabled={$settings.enableDynamicPomos}
            min="20"
            max="120" />
        </div>
      </div>
    </div>
    <div class="dynamic-options">
      <div class="form-field-group">
        <label for="enableDynamicPomos">
          <input
            type="checkbox"
            bind:checked={$settings.enableDynamicPomos}
            name="enableDynamicPomos" />
          Enable Dynamic Pomodoros
        </label>
      </div>
    </div>
  </form>
</div>
