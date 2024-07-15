<script lang="ts">
    import { onMount } from "svelte";
    import type { ConnectorInterface } from "../../connectors/connectorInterface";
    import { Connector } from "../../connectors/CookieConnector";
    import type { Pomodoro } from "./data/pomodoro";
    import { formatTime, formatTimeSeparated } from "../../util";

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
                    //TODO: ADD EVOLUTIONS
                    clearInterval(timer)
                }
                activePomodoro = connector.getActivePomodoro();
            }, 100);
        }
    }

    function updatePomodoroResting(){
        if(activePomodoro){
            let timer = setInterval(function () {
                activePomodoro = connector.getActivePomodoro();
                if(activePomodoro && activePomodoro.pomodoro 
                    && activePomodoro.pomodoro.resting 
                    && !activePomodoro.pomodoro.resting.finished 
                    && !activePomodoro.pomodoro.resting.paused){
                    connector.updateRestingTimer(activePomodoro.id)
                }
                else {
                    // Set Resting Active
                    if(activePomodoro.pomodoro.resting.finished){
                        connector.resetPomodoroResting(activePomodoro.id)
                        connector.resetPomodoro(activePomodoro.id)
                    }
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
    button {
        background: none;
    }
    .viewer-buttons:hover{
        cursor: pointer;
    }
    .viewer-buttons img {
        height: 40px;
        image-rendering: pixelated;
        padding: 5px;
    }
    .viewer-container{
        height: 100%;
        font-family: "Digimon World";
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: stretch;
    }
    .container-border {
        background-color: var(--border-light-color-2);
        border: solid 2px var(--stats-font-border-color);
        padding: 3px;
        height: 100%;
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
        border-bottom: 0;
        border-left: 0;
        border-top-right-radius: var(--border-radius);
        padding: 3px 3px 0px 3px;
        flex: 4;
    }
    .player-functions-border {
        border-top: 0;
        border-left: 0;
        padding: 0px 3px 3px 3px;
        border-bottom-right-radius: var(--border-radius);
        display: flex;
        flex: 2;
    }
    .time-container {
        border-bottom: 0;
        border-top-right-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
    .player-functions {
        width: 100%;
        border-top: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: start;
        border-bottom-right-radius: var(--border-radius);
    }
    .progress-bar-border {
        border-top: 0;
        border-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
        border-left: 0;
        flex: .5;
        height: 100%;
    }
    .progress-bar-border-2 {
        border-top: 0;
        border-bottom: 0;
        height: 100%;
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
        font-size: 120px;
        color: var(--font-title-highlight-color);
        margin-top: 10px;
        margin-bottom: 5px;
    }

    .time-container .current-time-sec {
        flex: 1;
        font-size: 70px;
        color: var(--font-title-highlight-color);
    }

    .backward img {
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
    }

    /* POMODORO TIMER */
</style>


<div class="viewer-container">
    {#key activePomodoro}
        <div class="time-container-border container-border">
            <div class="time-container container">
                <h1>{
                    activePomodoro ?
                    activePomodoro.pomodoro.finished ? "Resting Time" : "Time"
                    : "Time"}</h1>
                <h2 class="full-time">{
                activePomodoro ? 
                activePomodoro.pomodoro.finished ? formatTime(activePomodoro.pomodoro.resting.restingTimeInMs) : formatTime(activePomodoro.pomodoro.pomodoroTimeInMs) 
                : "00:00"
                }</h2>
                <h2 class="current-time-min">{
                activePomodoro ?
                activePomodoro.pomodoro.finished ? formatTimeSeparated(activePomodoro.pomodoro.resting.restingTimeInMs - activePomodoro.pomodoro.resting.currentTimeInMs)[0] : formatTimeSeparated(activePomodoro.pomodoro.pomodoroTimeInMs - activePomodoro.pomodoro.currentTimeInMs)[0] 
                : "00"}</h2>
                <h2 class="current-time-sec">{
                activePomodoro ? 
                activePomodoro.pomodoro.finished ? formatTimeSeparated(activePomodoro.pomodoro.resting.restingTimeInMs - activePomodoro.pomodoro.resting.currentTimeInMs)[1] : formatTimeSeparated(activePomodoro.pomodoro.pomodoroTimeInMs - activePomodoro.pomodoro.currentTimeInMs)[1]
                : "00"}</h2>
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
            {#if activePomodoro}
                {#if !activePomodoro.pomodoro.finished}
                    <button on:click={() => {
                        connector.setRestingState(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                    }} class="viewer-buttons backward"><img src="/images/forward.png" alt="Backward Button"/></button>
                    {#if activePomodoro.pomodoro.paused && activePomodoro.pomodoro.currentTimeInMs == 0}
                        <button on:click={() => {
                            connector.startPomodoro(activePomodoro.id)
                            updatePomodoro()
                        }} class="viewer-buttons"><img src="/images/play_pause_active.png" alt="Play Button"/></button>
                    {:else if !activePomodoro.pomodoro.paused}
                        <button on:click={() => {
                            let system = connector.pausePomodoro(activePomodoro.id)
                            activePomodoro = connector.getActivePomodoro()
                            system
                        }} class="viewer-buttons"><img src="/images/play_pause_inactive.png" alt="Stop Button"/></button>
                    {:else if activePomodoro.pomodoro.paused && activePomodoro.pomodoro.currentTimeInMs > 0 && activePomodoro.pomodoro.currentTimeInMs != activePomodoro.pomodoro.pomodoroTimeInMs}
                        <button on:click={() => {
                            connector.unpausePomodoro(activePomodoro.id)
                            updatePomodoro()
                        }} class="viewer-buttons"><img src="/images/play_pause_active.png" alt="Resume Button"/></button>
                        <button on:click={() => {
                            connector.resetPomodoro(activePomodoro.id)
                            activePomodoro = connector.getActivePomodoro()
                        }} class="viewer-buttons"><img src="/images/reset.png" alt="Reset Button"/></button>
                    {/if}
                    <button on:click={() => {
                        connector.setRestingState(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                    }} class="viewer-buttons"><img src="/images/forward.png" alt="Forward Button"/></button>
                {:else}
                    <button on:click={() => {
                        connector.resetPomodoro(activePomodoro.id)
                        connector.resetPomodoroResting(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                    }} class="viewer-buttons backward"><img src="/images/forward.png" alt="Backward Button"/></button>
                    {#if activePomodoro.pomodoro.resting.paused && activePomodoro.pomodoro.resting.currentTimeInMs == 0}
                        <button on:click={() => {
                            connector.startPomodoroResting(activePomodoro.id)
                            updatePomodoroResting()
                        }} class="viewer-buttons"><img src="/images/play_pause_active.png" alt="Play Button"/></button>
                    {:else if !activePomodoro.pomodoro.resting.paused}
                        <button on:click={() => {
                            let system = connector.pausePomodoroResting(activePomodoro.id)
                            activePomodoro = connector.getActivePomodoro()
                            system
                        }} class="viewer-buttons"><img src="/images/play_pause_inactive.png" alt="Stop Button"/></button>
                    {:else if activePomodoro.pomodoro.resting.paused && activePomodoro.pomodoro.resting.currentTimeInMs > 0 && activePomodoro.pomodoro.resting.currentTimeInMs != activePomodoro.pomodoro.resting.restingTimeInMs}
                        <button on:click={() => {
                            connector.unpausePomodoroResting(activePomodoro.id)
                            updatePomodoroResting()
                        }} class="viewer-buttons"><img src="/images/play_pause_active.png" alt="Resume Button"/></button>
                        <button on:click={() => {
                            connector.resetPomodoroResting(activePomodoro.id)
                            activePomodoro = connector.getActivePomodoro()
                        }} class="viewer-buttons"><img src="/images/reset.png" alt="Reset Button"/></button>
                    {/if}
                    <button on:click={() => {
                        connector.resetPomodoroResting(activePomodoro.id)
                        connector.resetPomodoro(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                    }} class="viewer-buttons"><img src="/images/forward.png" alt="Forward Button"/></button>
                {/if}
            {:else}
                <button class="viewer-buttons">
                    <img src="/images/play_pause_active.png" alt="Play Button"/>
                </button>
            {/if}
        </div>
    </div>
</div>
<svelte:window on:beforeunload={beforeUnload}/> 