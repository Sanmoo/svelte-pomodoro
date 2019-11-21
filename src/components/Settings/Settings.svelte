<script>
  import settings from '../../stores/settings.js'

  function requestNotificationPermission() {
    return new Promise(resolve => {
      if (!('Notification' in window)) {
        alert('This browser does not support notifications')
        console.log('unsupported')
        return resolve(false)
      } else if (Notification.permission === 'granted') {
        console.log(Notification.permission)
        return resolve(true)
      } else if (Notification.permission === 'denied') {
        Notification.requestPermission(permission => {
          console.log('Requested and got:', Notification.permission)
          return resolve(permission === 'granted')
        })
        return
      }
      console.log(Notification.permission)
      return resolve(false)
    })
  }
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

  a:hover {
    cursor: pointer;
  }

  div.actions {
    margin-bottom: 0.6em;
  }
</style>

<div>
  <h2>Your Settings</h2>
  <form>
    <div class="traditional-options">
      <div class="actions">
        <a on:click={requestNotificationPermission}>Enable Alerts</a>
      </div>
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
