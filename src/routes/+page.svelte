<script lang="ts">
    import type { ConnectorInterface } from "../lib/connectors/connectorInterface";
    import { Connector } from "../lib/connectors/CookieConnector"
    import { onMount } from 'svelte';
    import PomodoroViewer from "../lib/components/pomodoro/PomodoroViewer.svelte";
    import type {System} from "../lib/system";
    import DigimonViewer from "../lib/components/digimon/DigimonViewer.svelte";
    import Folder from "../lib/Folder.svelte";
    import Dictionary from "../lib/components/dictionary/Dictionary.svelte";

    const dataConnector: ConnectorInterface = new Connector()
    let system: System | null = null

    onMount(async () => {
        system = await dataConnector.getSystem()
    })
</script>

<svelte:head>
	<title>Digimon Pomodoro</title>
	<meta name="description" content="Digimon Pomodoro App" />
</svelte:head>
<style>
	section {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
        height: 100%;
        width: 100%;
        background-color: rgb(30, 33, 31);
	}
    .container {
        display: flex;
		flex-direction: row;
        justify-content: center;
        align-items: center;
        height: var(--max-height-w1920);
        width: var(--max-witdh-w1920);
    }

    .noise-filter {
        z-index: -1;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: .1;
        filter: contrast(150%) brightness(100%);
        background: 
            radial-gradient(circle at 50% 50%, rgb(0, 0, 0), rgba(255,255,255,0)),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");

    }

    @media (max-width: 1070px) {
        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: var(--max-height-w1070);
            width: 100%;
        }
    }
</style>
<section>
    <Folder>
        <div class="container" slot="main">
            {#key system}
                <DigimonViewer callback={(sys) => system = sys}/>
                <PomodoroViewer callback={(sys) => system = sys}/>
            {/key}
        </div>
        <div class="container" slot="dictionary">
            {#key system}
                <Dictionary system={system}/>
            {/key}
        </div>
    </Folder>
    <div class="noise-filter"></div>
</section>