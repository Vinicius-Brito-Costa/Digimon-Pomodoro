<script lang="ts">
    import { onMount } from "svelte";
    import type { ConnectorInterface } from "../../connectors/connectorInterface";
    import { Connector } from "../../connectors/CookieConnector";
    import {Pomodoro} from "./data/pomodoro";
    import { formatTime, formatTimeSeparated } from "../../util";
    import { getRandomEvolution } from "../../requestHandler";
    import Digimon from "../digimon/data/digimon";
    import { base } from '$app/paths'
    export let callback: Function

    const connector: ConnectorInterface = new Connector()
    let activePomodoro: Pomodoro | null = null
    function notificationFunction(title: string, msg: string){
        if(!("Notification" in window)){
            throw new Error("Your browser does not support push notification");
        }
        Notification.requestPermission().then((Permission)=>{
            const notificationOptions = {
                body: msg,
                icon:"/images/play_pause_active.png"
            }
            new Notification(title,notificationOptions);
        })
    };

    onMount(async () => {
        activePomodoro = connector.getActivePomodoro()
        Notification.requestPermission()
    })


    function updatePomodoro(){
        if(activePomodoro){
            let timer = setInterval(async () => {
                activePomodoro = connector.getActivePomodoro();
                if(activePomodoro && activePomodoro.pomodoro && activePomodoro.pomodoro.active && !activePomodoro.pomodoro.paused){
                    await connector.updateTimer(activePomodoro.id).then(res => {
                        activePomodoro = connector.getActivePomodoro()
                    })
                }
                else {
                    if(activePomodoro.pomodoro.finished){
                        await connector.getSystem().then(async system => {
                            if(system && system.digimon){
                                await getRandomEvolution(system.digimon.name).then(result => {
                                    if(result){
                                        let next: Digimon = new Digimon()
                                        next.name = result
                                        system.digimon = next
                                        if(!system.digimonDictionary.find((digi) => digi.name == result)){
                                            system.digimonDictionary.push(next)
                                        }
                                        connector.saveSystem(system)
                                        callback(system)
                                        notificationFunction("Focus time Finished!", "You current focus time has finished, please start the resting time.")
                                    }
                                })
                            }
                        })
                    }
                    activePomodoro = connector.getActivePomodoro()
                    clearInterval(timer)
                }
                activePomodoro = connector.getActivePomodoro();
            }, 100);
        }
    }

    async function updatePomodoroResting(){
        if(activePomodoro){
            let timer = setInterval(async function () {
                activePomodoro = connector.getActivePomodoro();
                if(activePomodoro && activePomodoro.pomodoro 
                    && activePomodoro.pomodoro.resting 
                    && !activePomodoro.pomodoro.resting.finished 
                    && !activePomodoro.pomodoro.resting.paused){
                    await connector.updateRestingTimer(activePomodoro.id)
                }
                else {
                    // Set Resting Active
                    if(activePomodoro.pomodoro.resting.finished){
                        await connector.resetPomodoroResting(activePomodoro.id)
                        await connector.resetPomodoro(activePomodoro.id)
                        notificationFunction("Resting time Finished!", "You current resting time has finished, please start the focus time.")
                    }
                    clearInterval(timer)
                }
                activePomodoro = connector.getActivePomodoro();
            }, 100);
        }
    }

    async function beforeUnload(event) {
        if (activePomodoro) {
            event.returnValue = '';
            await connector.pausePomodoro(activePomodoro.id)
            activePomodoro = connector.getActivePomodoro()
            return '';
        }
    }
    function getProgressBarPercentage(){
        if(activePomodoro && activePomodoro.pomodoro){
            if(!activePomodoro.pomodoro.finished){
                return `${activePomodoro.pomodoro.currentTimeInMs / (activePomodoro.pomodoro.pomodoroTimeInMs / 100)}%`
            }
            else {
                return `${activePomodoro.pomodoro.resting.currentTimeInMs / (activePomodoro.pomodoro.resting.restingTimeInMs / 100)}%`
            }
        }
        else {
            return "0%"
        }
    }
</script>
<style>
    .viewer-buttons {
        border-width: var(--button-border-width-w1920);
    }
    .viewer-buttons:hover{
        cursor: pointer;
    }
    .viewer-buttons img {
        height: var(--icon-size-height-w1920);
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
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        padding: var(--border-padding-w1920);
        height: 100%;
    }
    .container {
        color: var(--stats-font-color);
        background-color: var(--background-dark-color);
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
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
        border-top-right-radius: var(--border-radius-w1920);
        padding: var(--border-padding-w1920) var(--border-padding-w1920) 0px var(--border-padding-w1920);
        flex: 4;
    }
    .player-functions-border {
        border-top: 0;
        border-left: 0;
        padding: 0px var(--border-padding-w1920) var(--border-padding-w1920) var(--border-padding-w1920);
        border-bottom-right-radius: var(--border-radius-w1920);
        display: flex;
        flex: 2;
    }
    .time-container {
        border-bottom: 0;
        border-top-right-radius: var(--border-radius-w1920);
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
        border-bottom-right-radius: var(--border-radius-w1920);
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
        padding: 3px 10px;
        border-radius: var(--border-radius-w1920);
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        display: flex;
        align-items: center;
    }
    .progress-bar {
        background-color: var(--border-light-color-2);
        margin: 0 10px;
        height: 5px;
    }
    .time-container h1 {
        font-size: var(--font-size-title-w1920);
        text-shadow: 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black, 0 0 1px black;
    }
    .time-container h2 {
        margin: auto;
        /* Compensation for font missalignment */
        padding-left: 5px; 
    }
    .time-container .full-time {
        font-size: var(--font-size-clock-full-time-w1920);
        color: var(--font-title-highlight-color);
    }
    .time-container .current-time-min {
        font-size: var(--font-size-clock-min-w1920);
        color: var(--font-title-highlight-color);
        margin-top: 10px;
        margin-bottom: 5px;
    }

    .time-container .current-time-sec {
        flex: 1;
        font-size: var(--font-size-clock-sec-w1920);
        color: var(--font-title-highlight-color);
    }

    .backward img {
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
    }

    /* POMODORO TIMER */

    @media (max-width: 1070px) {
        .viewer-container {
            height: 50%;
            width: 100%;
            display: flex;
        }
        .container-border {
            height: 50%;
        }
        .time-container-border {
            border-top: 0px;
            padding-top: calc(var(--border-padding-w1070) / 2);
            border-left: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
            border-top-right-radius: 0;
            height: auto;
        }
        .time-container{
            border-top-right-radius: 0;
            padding: 0;
        }

        .time-container h1 {
            font-size: var(--font-size-title-w1070);
            margin: 0;
            margin-top: 5px;
        }

        .time-container .full-time {
            font-size: var(--font-size-clock-full-time-w1070);
        }
        .time-container .current-time-min {
            font-size: var(--font-size-clock-min-w1070);
            margin-top: 5px;
            margin-bottom: 5px;
        }

        .time-container .current-time-sec {
            flex: 1;
            font-size: var(--font-size-clock-sec-w1070);
        }
        .progress-bar-border {
            padding-bottom: 5px;
            height: auto;
            border-left: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        }
        .progress-bar-border-2 {
            height: 100%;
            padding: 3px;
        }
        .progress-bar-spacer {
            height: 10px;
            width: 80%;
            padding: 1px 10px;
        }
        .player-functions-border {
            height: auto;
            border-left: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
            border-bottom-left-radius: var(--border-radius-w1070);
        }
        .player-functions {
            width: 100%;
            border-top: 0;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: start;
            border-bottom-left-radius: var(--border-radius-w1070);
            padding-top: 0;
            padding-bottom: 2px;
        }
        .viewer-buttons {
            flex: 1;
            display: flex;
            justify-content: center;
            width: var(--icon-size-width-w1070);
        }
        
        .viewer-buttons img {
            height: var(--icon-size-height-w1070);
            image-rendering: pixelated;
            padding: 0;
        }
    }
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
                    <div class="progress-bar" style="width: {getProgressBarPercentage()};"></div>
                </div>
            </div>
        </div>
    {/key}
    <div class="player-functions-border container-border">
        <div class="player-functions container">
            {#if activePomodoro}
                {#if !activePomodoro.pomodoro.finished}
                    <button on:click={async () => {
                        await connector.setRestingState(activePomodoro.id).then(res => {
                            activePomodoro = connector.getActivePomodoro()
                        })
                    }} class="viewer-buttons backward"><img src="{base}/images/forward.png" alt="Backward Button"/></button>
                    {#if activePomodoro.pomodoro.paused && activePomodoro.pomodoro.currentTimeInMs == 0}
                        <button on:click={async (e) => {
                            await connector.startPomodoro(activePomodoro.id).then(res => {
                                activePomodoro = connector.getActivePomodoro()
                                updatePomodoro()
                            })
                        }} class="viewer-buttons"><img src="{base}/images/play_pause_active.png" alt="Play Button"/></button>
                    {:else if !activePomodoro.pomodoro.paused}
                        <button on:click={async () => {
                            let system = await connector.pausePomodoro(activePomodoro.id)
                            activePomodoro = connector.getActivePomodoro()
                            system
                        }} class="viewer-buttons"><img src="{base}/images/play_pause_inactive.png" alt="Stop Button"/></button>
                    {:else if activePomodoro.pomodoro.paused && activePomodoro.pomodoro.currentTimeInMs > 0 && activePomodoro.pomodoro.currentTimeInMs != activePomodoro.pomodoro.pomodoroTimeInMs}
                        <button on:click={async () => {
                            await connector.unpausePomodoro(activePomodoro.id)
                            updatePomodoro()
                        }} class="viewer-buttons"><img src="{base}/images/play_pause_active.png" alt="Resume Button"/></button>
                        <button on:click={async () => {
                            await connector.resetPomodoro(activePomodoro.id)
                            activePomodoro = connector.getActivePomodoro()
                        }} class="viewer-buttons"><img src="{base}/images/reset.png" alt="Reset Button"/></button>
                    {/if}
                    <button on:click={async () => {
                        await connector.setRestingState(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                    }} class="viewer-buttons"><img src="{base}/images/forward.png" alt="Forward Button"/></button>
                {:else}
                    <button on:click={async () => {
                        await connector.resetPomodoro(activePomodoro.id)
                        await connector.resetPomodoroResting(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                    }} class="viewer-buttons backward"><img src="{base}/images/forward.png" alt="Backward Button"/></button>
                    {#if activePomodoro.pomodoro.resting.paused && activePomodoro.pomodoro.resting.currentTimeInMs == 0}
                        <button on:click={async () => {
                            await connector.startPomodoroResting(activePomodoro.id)
                            updatePomodoroResting()
                        }} class="viewer-buttons"><img src="{base}/images/play_pause_active.png" alt="Play Button"/></button>
                    {:else if !activePomodoro.pomodoro.resting.paused}
                        <button on:click={async () => {
                            let system = await connector.pausePomodoroResting(activePomodoro.id)
                            activePomodoro = connector.getActivePomodoro()
                            system
                        }} class="viewer-buttons"><img src="{base}/images/play_pause_inactive.png" alt="Stop Button"/></button>
                    {:else if activePomodoro.pomodoro.resting.paused && activePomodoro.pomodoro.resting.currentTimeInMs > 0 && activePomodoro.pomodoro.resting.currentTimeInMs != activePomodoro.pomodoro.resting.restingTimeInMs}
                        <button on:click={async () => {
                            await connector.unpausePomodoroResting(activePomodoro.id)
                            updatePomodoroResting()
                        }} class="viewer-buttons"><img src="{base}/images/play_pause_active.png" alt="Resume Button"/></button>
                        <button on:click={async () => {
                            await connector.resetPomodoroResting(activePomodoro.id)
                            activePomodoro = connector.getActivePomodoro()
                        }} class="viewer-buttons"><img src="{base}/images/reset.png" alt="Reset Button"/></button>
                    {/if}
                    <button on:click={async () => {
                        await connector.resetPomodoroResting(activePomodoro.id)
                        await connector.resetPomodoro(activePomodoro.id)
                        activePomodoro = connector.getActivePomodoro()
                    }} class="viewer-buttons"><img src="{base}/images/forward.png" alt="Forward Button"/></button>
                {/if}
            {:else}
                <button class="viewer-buttons">
                    <img src="{base}/images/play_pause_active.png" alt="Play Button"/>
                </button>
            {/if}
        </div>
    </div>
</div>
<svelte:window on:beforeunload={beforeUnload}/> 