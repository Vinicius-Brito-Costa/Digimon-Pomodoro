
<script lang="ts">
    import { onMount } from "svelte";
    import type { ConnectorInterface } from "../../connectors/connectorInterface";
    import { Connector } from "../../connectors/CookieConnector";
    import { getDigimonByName, getRandomBabyIDigimon } from "../../requestHandler"
    import { System } from "../../system";
    import Digimon from "./data/digimon";
    export let callback: Function
    const connector: ConnectorInterface = new Connector()
    let system: System | null = null

    onMount(async () => {
        system = await connector.getSystem()
    })
</script>

<style>
    .main-container {
        font-family: "Digimon World";
        flex: 1;
        height: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        max-width: var(--max-witdh-w1920);
    }
    .container-border {
        flex: 1;
        border-top-left-radius: var(--border-radius-w1920);
        border-bottom-left-radius: var(--border-radius-w1920);
        background-color: var(--border-light-color-2);
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        padding: var(--border-padding-w1920);
        padding-right: 1.5px;
        border-right: 0;
        display: flex;
        max-width: var(--max-witdh-w1920) -6px;
    }
    .container {
        border-top-left-radius: var(--border-radius-w1920);
        border-bottom-left-radius: var(--border-radius-w1920);
        color: var(--stats-font-color);
        background-color: var(--background-dark-color);
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: var(--font-size-title-w1920);
        color: var(--font-title-highlight-color);
    }
    .container h1 {
        max-width: 300px;
        margin: 0;
        padding: 10px 0;
        font-size: var(--font-size-title-w1920);
        text-transform: capitalize;
    }
    .img-container {
        display: flex;
        width: 100%;
        overflow: hidden;
        flex: 1;
    }
    .digimon-container {
        width: 100%;
        text-align: center;
        overflow: hidden;
    }
    .loading-container{
        flex: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .loading-container span {
        width: 100%;
    }

    .img-container {
        justify-content: center;
        position: relative;
    }
    .img-container img {
        flex: 1;
        object-fit:cover;
        object-position: center;
        border-top-left-radius: var(--border-radius-w1920);
        border-bottom: solid 2px var(--stats-font-border-color);
    }

    .reset-button {
        position: absolute;
        border-width: var(--button-border-width-w1920);
        padding-top: 5px;
        margin-top: 5px;
        margin-left: 5px;
        cursor: pointer;
        left: 0;
    }

    .reset-button img {
        height: var(--icon-size-height-w1920);
        image-rendering: pixelated;
        border: none;
    }

    @media (max-width: 1070px) {
        .main-container {
            height: 50%;
            width: 100%;
        }
        .container-border {
            border-top-left-radius: var(--border-radius-w1070);
            border-top-right-radius: var(--border-radius-w1070);
            border-bottom-left-radius: 0;
            background-color: var(--border-light-color-2);
            border: solid var(--border-width-minor-w1070) var(--stats-font-border-color);
            border-bottom: 0;
            padding: var(--border-padding-w1070);
            padding-bottom: calc(var(--border-padding-w1070) / 2);
            max-width: calc(100% - 22px);
        }
        .container {
            border-top-left-radius: var(--border-radius-w1070);
            border-top-right-radius: var(--border-radius-w1070);
            border-bottom-left-radius: 0;
            border: solid var(--border-width-minor-w1070) var(--stats-font-border-color);
            font-size: var(--font-size-title-w1070);
        }
        .container h1 {
            max-width: 50%;
            font-size: var(--font-size-title-w1070);
        }
        .reset-button img {
            height: var(--icon-size-height-w1070);
            image-rendering: pixelated;
            border: none;
        }
    }
</style>

{#key system}
<div class="main-container">
    <div class="container-border">
        <div class="digimon-container container">
            {#if system && system.digimon}
                {#await getDigimonByName(system.digimon.name)}
                    <div class="loading-container">
                        <span>Loading...</span>
                    </div>
                {:then digimon}
                    {#if digimon.images[0]}
                        <div class="img-container">
                            <button on:click={async () => {
                                let result = await connector.getSystem().then(async sys => {
                                    return getRandomBabyIDigimon().then(async res => {
                                        let newDigimon = new Digimon()
                                        newDigimon.name = res.name
                                        sys.digimon = newDigimon
                                        if(!sys.digimonDictionary.find(digi => digi.name == sys.digimon.name)){
                                            sys.digimonDictionary.push(sys.digimon)
                                        }
                                        connector.saveSystem(sys)
                                        return await connector.resetPomodoro(connector.getActivePomodoro().id)
                                    })
                                })
                                if(result){
                                    system = result
                                    callback(system)
                                }
                            }} class="reset-button"><img src="/images/reset.png" alt="Reset Button"/></button>
                            <img src={digimon.images[0].href} alt={digimon.name}/>
                        </div>
                        <h1>{digimon.name}</h1>
                    {/if}
                {/await}
            {/if}
        </div>
    </div>
</div>
{/key}