<script lang="ts">
    import type { ConnectorInterface } from "../../connectors/connectorInterface";
    import { Connector } from "../../connectors/CookieConnector"
    import type { Pomodoro } from "./data/pomodoro";
    import { formatTime } from "../../util"
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