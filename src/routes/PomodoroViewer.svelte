<script lang="ts">
    import { onMount } from "svelte";
    import type { ConnectorInterface } from "../lib/connectors/connectorInterface";
    import { Connector } from "../lib/connectors/CookieConnector";
    import type { Pomodoro } from "../lib/pomodoro/pomodoro";
    import { System } from "../lib/system";
    import { formatTime, formatTimeSeparated } from "../lib/util";

    export let callback: Function

    const connector: ConnectorInterface = new Connector()
    let activePomodoro: Pomodoro | null = null

    onMount(() => {
        activePomodoro = connector.getActivePomodoro()
    })


    function updatePomodoro(){
        if(activePomodoro){
            let timer = setInterval(function () {
                activePomodoro = connector.getActivePomodoro();
                if(activePomodoro && activePomodoro.pomodoro && activePomodoro.pomodoro.active && !activePomodoro.pomodoro.paused){
                    connector.updateTimer(activePomodoro.id)
                }
                else {
                    clearInterval(timer)
                }
                activePomodoro = connector.getActivePomodoro();
            }, 100);
        }
    }

    function beforeUnload(event) {
        if (activePomodoro) {
            event.preventDefault();
            event.returnValue = '';
            connector.pausePomodoro(activePomodoro.id)
            activePomodoro = connector.getActivePomodoro()
            return '';
        }
  }
</script>
<style>
    .viewer-container{
        width: 100%;
        font-family: "Digimon World";
        display: flex;
        flex: 1;
        flex-direction: column;
    }
    .title {
        margin: 0;
        color: var(--font-title-highlight-color);
        font-size: 25px;
    }
    .container-border {
        background-color: var(--border-light-color-2);
        border: solid 2px var(--stats-font-border-color);
        padding: 3px;
    }
    .container {
        color: var(--stats-font-color);
        background-color: var(--background-dark-color);
        border: solid 2px var(--stats-font-border-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    /* POMODORO TIMER */
    .time-container-border {
        border-left: 0;
        border-bottom: 0;
        border-top-right-radius: var(--border-radius);
        padding: 3px 3px 0px 1.5px;
    }
    .player-functions-border {
        border-top: 0;
        border-left: 0;
        border-bottom: 0;
        padding: 0px 3px 1.5px 1.5px;
    }
    .time-container {
        border-bottom: 0;
        border-top-right-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .player-functions {
        border-top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .progress-bar-border {
        border-top: 0;
        border-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
        border-left: 0;
        padding-left: 1.5px;
        
    }
    .progress-bar-border-2 {
        border-top: 0;
        border-bottom: 0;
    }
    .progress-bar-spacer {
        background-color: var(--data-area-background-color);
        height: 15px;
        width: 90%;
        border-radius: var(--border-radius);
        border: solid 2px var(--stats-font-border-color);
        display: flex;
        align-items: center;
    }
    .progress-bar {
        background-color: var(--border-light-color-2);
        margin-left: 5%;
        height: 5px;
        width: 70%;
    }
    .time-container h1 {
        text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;
    }
    .time-container h2 {
        margin: auto;
        /* Compensation for font missalignment */
        padding-left: 5px; 
    }
    .time-container .full-time {
        font-size: 20px;
        color: var(--font-title-highlight-color);
    }
    .time-container .current-time-min {
        font-size: 80px;
        color: var(--font-title-highlight-color);
        margin-top: 10px;
        margin-bottom: 5px;
    }

    .time-container .current-time-sec {
        font-size: 40px;
        color: var(--font-title-highlight-color);
    }

    /* POMODORO TIMER */
</style>


<div class="viewer-container">
    {#if activePomodoro}
        {#key activePomodoro}
            <h1 class="title">{activePomodoro.pomodoro.title}</h1>
            <div class="time-container-border container-border">
                <div class="time-container container">
                    <h1>Time</h1>
                    <h2 class="full-time">{formatTime(activePomodoro.pomodoro.pomodoroTimeInMs)}</h2>
                    <h2 class="current-time-min">{formatTimeSeparated(activePomodoro.pomodoro.pomodoroTimeInMs - activePomodoro.pomodoro.currentTimeInMs)[0]}</h2>
                    <h2 class="current-time-sec">{formatTimeSeparated(activePomodoro.pomodoro.pomodoroTimeInMs - activePomodoro.pomodoro.currentTimeInMs)[1]}</h2>
                </div>
            </div>
            <div class="progress-bar-border container-border">
                <div class="progress-bar-border-2 container">
                    <div class="progress-bar-spacer">
                        <div class="progress-bar"></div>
                    </div>
                </div>
            </div>
        {/key}
        <div class="player-functions-border container-border">
            <div class="player-functions container">
                {#if activePomodoro.pomodoro.paused && activePomodoro.pomodoro.currentTimeInMs == 0}
                    <button on:click={() => {
                        callback(connector.startPomodoro(activePomodoro.id))
                        updatePomodoro()
                    }}>PLAY</button>
                {:else if !activePomodoro.pomodoro.paused}
                    <button on:click={() => {
                        let system = connector.pausePomodoro(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                        callback(system)
                    }}>STOP</button>
                {:else if activePomodoro.pomodoro.paused && activePomodoro.pomodoro.currentTimeInMs > 0 && activePomodoro.pomodoro.currentTimeInMs != activePomodoro.pomodoro.pomodoroTimeInMs}
                    <button on:click={() => {
                        callback(connector.unpausePomodoro(activePomodoro.id))
                        updatePomodoro()
                    }}>RESUME</button>
                    <button on:click={() => {
                        connector.resetPomodoro(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                    }}>RESET</button>
                {:else}
                    <button on:click={() => {
                        connector.resetPomodoro(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                    }}>RESET</button>
                {/if}
            </div>
        </div>
    {:else}
        <h1>No Active Pomodoro</h1>
    {/if} 
</div>
<svelte:window on:beforeunload={beforeUnload}/> 