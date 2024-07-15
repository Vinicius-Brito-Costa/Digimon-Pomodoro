
<script lang="ts">
    import { getDigimonByName } from "../../requestHandler"
</script>

<style>
    .main-container {
        font-family: "Digimon World";
        flex: 1;
        height: 100%;
        padding: 0;
        margin: 0;
        display: flex;
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
        font-size: 40px;
        color: var(--font-title-highlight-color);
    }
    .container h1 {
        margin: 0;
        padding: 10px 0;
        text-transform: capitalize;
    }
    .img-container {
        display: flex;
        width: 100%;
        overflow: hidden;
        flex: 1;
    }

    .img-container img {
        flex: 1;
        object-fit:cover;
    }
</style>

<div class="main-container">
    <div class="container-border">
        <div class="digimon-container container">
            {#await getDigimonByName("agumon")}
                Loading...
            {:then digimon}
                {#if digimon.images[0]}
                    <div class="img-container">
                        <img src={digimon.images[0].href} alt={digimon.name}/>
                    </div>
                    <h1>{digimon.name}</h1>
                {/if}
            {/await}
        </div>
    </div>
</div>