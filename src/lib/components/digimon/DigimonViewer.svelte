
<script lang="ts">
    import { onMount } from "svelte";
    import type { ConnectorInterface } from "../../connectors/connectorInterface";
    import { Connector } from "../../connectors/CookieConnector";
    import { getDigimonByName, getRandomBabyIDigimon } from "../../requestHandler"
    import { System } from "../../system";
  import Digimon from "./data/digimon";
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
        max-width: 300px;
    }
    .container-border {
        flex: 1;
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
        background-color: var(--border-light-color-2);
        border: solid 2px var(--stats-font-border-color);
        padding: 3px;
        padding-right: 1.5px;
        border-right: 0;
        display: flex;
        max-width: 300px;
    }
    .container {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
        color: var(--stats-font-color);
        background-color: var(--background-dark-color);
        border: solid 2px var(--stats-font-border-color);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: clamp(10px, 3rem, 40px);
        color: var(--font-title-highlight-color);
    }
    .container h1 {
        max-width: 300px;
        margin: 0;
        padding: 10px 0;
        font-size: clamp(5px, 1rem, 40px);
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

    .img-container img {
        flex: 1;
        object-fit:cover;
        border-top-left-radius: var(--border-radius);
        border-bottom: solid 2px var(--stats-font-border-color);
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
                                    return getRandomBabyIDigimon().then(res => {
                                        let newDigimon = new Digimon()
                                        newDigimon.name = res.name
                                        sys.digimon = newDigimon
                                        if(!sys.digimonDictionary.find(digi => digi.name == sys.digimon.name)){
                                            sys.digimonDictionary.push(sys.digimon)
                                        }
                                        connector.saveSystem(sys)
                                        return sys
                                    })
                                })
                                if(result){
                                    system = result
                                }
                            }} class="viewer-buttons"><img src="/images/reset.png" alt="Reset Button"/></button>
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