
<script lang="ts">
    import { onMount } from "svelte";
    import { Pomodoro } from "./components/pomodoro/data/pomodoro";
    import type { ConnectorInterface } from "./connectors/connectorInterface";
    import { Connector } from "./connectors/CookieConnector";

    let mainActive: Boolean = true, dictionaryActive: Boolean = false   
    const connector: ConnectorInterface = new Connector()
    
</script>
<style>
    .folder-container {
        position: relative;
        display: flex;
        flex-direction: column;
        height: var(--max-height-w1920);
        width: var(--max-witdh-w1920);
        z-index: 1;
    }
    .tab-container {
        display: flex;
        margin-left: 10px;
    }

    .tab {
        padding: 10px 5px;
        padding-left: 10px;
        padding-bottom: 5px;
        border-top-left-radius: var(--border-radius-w1920);
        border-top-right-radius: var(--border-radius-w1920);
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        background-color: var(--background-dark-color);
        color: var(--font-title-not-selected-color);
        border-bottom: none;
        cursor: pointer;
        font-family: "Digimon World";
    }
    .tab h2 {
        margin: 0;
    }
    .active {
        padding-bottom: 5px;
        background-color: var(--border-light-color-2);
        color: var(--font-title-highlight-color);
        text-shadow: 0px 0px 2px black,  0px 0px 2px black,  0px 0px 2px black,  0px 0px 2px black;
        border-bottom: none;
        cursor:context-menu;
    }

    @media (max-width: 1070px) {
        .folder-container {
            height: var(--max-height-w1070);
            width: var(--max-witdh-w1070);
            z-index: 1;
        }
        .tab {
            padding: 5px 5px;
            padding-left: 5px;
            padding-bottom: 5px;
            font-size: 10px;
        }
    }
</style>

<div class="folder-container">
    <div class="tab-container">
        <div class="folder-tab">
            <button class="tab {mainActive ? "active" : ""}" on:click={() => {
                mainActive = true
                dictionaryActive = false
            }}>
                <h2>Pomodoro</h2>
            </button>
        </div>
        <div class="folder-tab">
            <button class="tab {dictionaryActive ? "active" : ""}" on:click={() => {
                mainActive = false
                dictionaryActive = true
                connector.pausePomodoro(connector.getActivePomodoro().id)
            }}>
                <h2>Dictionary</h2>
            </button>
        </div>
    </div>
    {#if mainActive}
        <slot name="main"/>
    {/if}
    {#if dictionaryActive}
        <slot name="dictionary"/>
    {/if}
</div>