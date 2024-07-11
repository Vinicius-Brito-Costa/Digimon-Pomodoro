<script lang="ts">
    import { getDigimonByName } from "./requestHandler"
    import type { ConnectorInterface } from "../lib/connectors/connectorInterface";
    import { Connector } from "../lib/connectors/CookieConnector"
    import { onMount } from 'svelte';
    import PomodoroViewer from "./PomodoroViewer.svelte";
    import PomodoroList from "./PomodoroList.svelte";
    import type {Pomodoro} from "../lib/pomodoro/pomodoro";
    import type {System} from "../lib/system";
  import PomodoroForm from "./PomodoroForm.svelte";

    const dataConnector: ConnectorInterface = new Connector()
    let system: System | null = null
    let activePomodoro: Pomodoro | null = null

    onMount(() => {
        system = dataConnector.getSystem()
        activePomodoro = dataConnector.getActivePomodoro()
    })
    

    function formatTime(time: number) : string{
        let totalSeconds: number = parseInt(String(Math.floor(time / 1000)), 10);
        let totalMinutes: number = parseInt(String(Math.floor(totalSeconds / 60)), 10);
        return `${String(totalMinutes).padStart(2, "0")}:${String(totalSeconds - (totalMinutes * 60)).padStart(2, "0")}`
    }

    function updatePomodoro(){
        if(system){
            let timer = setInterval(function () {
                activePomodoro = dataConnector.getActivePomodoro();
                if(activePomodoro && activePomodoro.pomodoro && activePomodoro.pomodoro.active && !activePomodoro.pomodoro.paused){
                    system = dataConnector.updateTimer(activePomodoro.id)
                }
                else {
                    clearInterval(timer)
                }
                activePomodoro = dataConnector.getActivePomodoro();
            }, 100);
        }
    }

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
<section>
    {#await getDigimonByName("agumon")}
        Loading...
    {:then digimon}
        {digimon.name}
        {#if digimon.images[0]}
            <img src={digimon.images[0].href} alt={digimon.name}/>
        {/if}
    {/await}
    
    {#key activePomodoro}
        <PomodoroViewer
        title={activePomodoro ? activePomodoro.pomodoro.title : "No Active Pomodoro"}
        currentTime={activePomodoro ? formatTime(activePomodoro.pomodoro.pomodoroTimeInMs - activePomodoro.pomodoro.currentTimeInMs) : "00:00"}
        target={activePomodoro ? formatTime(activePomodoro.pomodoro.pomodoroTimeInMs) : "00:00"}/>
    {/key}
    
    {#key system}
        <PomodoroList system={system}/>
    {/key}
    
    <PomodoroForm callback={(data) => {
        system = data
        activePomodoro = dataConnector.getActivePomodoro()
    }}/>

    <button on:click={() => {
        activePomodoro = dataConnector.getActivePomodoro()
        system = dataConnector.startPomodoro(activePomodoro.id)
        updatePomodoro()
        }}>Start Pomodoro</button>
    
    <button on:click={() => {
        system = dataConnector.resetPomodoro(activePomodoro.id)
        activePomodoro = dataConnector.getActivePomodoro()
    }} >Reset active Pomodoro</button>

    <button on:click={() => {
        system =  dataConnector.pausePomodoro(activePomodoro.id)
        activePomodoro = dataConnector.getActivePomodoro()
    }} >Pause active Pomodoro</button>

    <button on:click={() => {
        system = dataConnector.unpausePomodoro(activePomodoro.id)
        activePomodoro = dataConnector.getActivePomodoro()
        updatePomodoro()
    }} >Unpause active Pomodoro</button>`
    
    <button on:click={() => {
        system = dataConnector.savePomodoro(activePomodoro)
    }} >Create Pomodoro</button>

    <button on:click={() => {
        activePomodoro = dataConnector.getActivePomodoro()
        if(activePomodoro){
            system = dataConnector.deletePomodoro(activePomodoro.id)
            activePomodoro = dataConnector.getActivePomodoro()
        }
    }} >Delete active Pomodoro</button>

</section>