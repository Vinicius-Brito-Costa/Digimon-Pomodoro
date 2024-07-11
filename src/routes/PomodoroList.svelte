<script>
    export let system
</script>
<style></style>

<div>
    {#if system && system.pomodoros && system.pomodoros.length > 0}
        {#each system.pomodoros as data}
            <div>{data.pomodoro.title}</div>
        {/each}
    {:else}
        <h3>No pomodoros</h3>
    {/if}
</div>