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
<style>
    .container {
        display: flex;
		flex-direction: row;
        justify-content: center;
        align-items: center;
        height: var(--max-height-w1920);
        width: var(--max-witdh-w1920);
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