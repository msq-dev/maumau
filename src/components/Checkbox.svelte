<script>
  export let val
  export let checkboxName
</script>

<label for={checkboxName}>
  <input id={checkboxName} type="checkbox" bind:checked={val} />
  <slot />
</label>

<style>
</style>
