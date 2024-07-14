<script lang="ts">
    import type { ConnectorInterface } from "../lib/connectors/connectorInterface";
    import { Connector } from "../lib/connectors/CookieConnector"
    import type { Pomodoro } from "../lib/pomodoro/pomodoro";
    import { System } from "../lib/system";
    import { formatTime } from "../lib/util"
    export let pomodoros: Pomodoro[], callback: Function

    const connector: ConnectorInterface = new Connector()
</script>
<style>
    .pomodoro-container{
        display: flex;
    }

</style>

<div>
    {#if pomodoros && pomodoros.length > 0}
        {#each pomodoros as data}
            <div class="pomodoro-container">
                {#if !data.pomodoro.active}
                    <button on:click={() => callback(connector.setActivePomodoro(data.id))} class="btn-set-active">X</button>
                {/if}
                <span class="title">{data.pomodoro.title}</span>
                <span class="time">{formatTime(data.pomodoro.pomodoroTimeInMs)}</span>
            </div>
        {/each}
    {:else}
        <h3>No pomodoros</h3>
    {/if}
</div>