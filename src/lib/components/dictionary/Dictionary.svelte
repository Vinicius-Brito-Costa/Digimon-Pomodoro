<script lang="ts">
  import { buildDigimonImageURLByName } from "../../requestHandler";
    import { System } from "../../system";
    export let system: System
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
        border-radius: var(--border-radius-w1920);
        background-color: var(--border-light-color-2);
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        padding: var(--border-padding-w1920);
        display: flex;
        flex-wrap: wrap;
        max-width: var(--max-witdh-w1920) -6px;
        overflow: hidden;
    }
    .list-container {
        border-radius: var(--border-radius-w1920);
        background-color: var(--border-dark-color-2);
        overflow: hidden;
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
        width: 100%;
        height: calc(100% - 6px);
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-content: flex-start;
        overflow-y: scroll;
    }
    .digimon-slot{
        height: calc(var(--max-witdh-w1920) / 9);
        overflow: hidden;
        display: flex;
        padding: 0;
        border: solid var(--border-width-minor-w1920) var(--stats-font-border-color);
    }
    .digimon-slot img {
        
        width: 100%;
        height: 100%;
    }
    @media (max-width: 1070px) {
        .dict-container {
            width: 100%;
            height: 100%;
        }
        .digimon-slot{
            height: var(--icon-size-height-w1070);
            width: var(--icon-size-width-w1070);
        }
    }
</style>
<div class="dict-container main-container">
    <div class="container-border">
        <div class="list-container">
            {#each system.digimonDictionary as digimon}
                <div class="digimon-slot">
                    <img src={buildDigimonImageURLByName(digimon.name)} alt={digimon.name} title={digimon.name}/>
                </div>
            {/each}
        </div>
    </div>
</div>