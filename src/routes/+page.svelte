<script lang="ts">
    import type { ConnectorInterface } from "../lib/connectors/connectorInterface";
    import { Connector } from "../lib/connectors/CookieConnector"
    import { onMount } from 'svelte';
    import PomodoroViewer from "../lib/components/pomodoro/PomodoroViewer.svelte";
    import type {System} from "../lib/system";
  import DigimonViewer from "../lib/components/digimon/DigimonViewer.svelte";

    const dataConnector: ConnectorInterface = new Connector()
    let system: System | null = null

    onMount(() => {
        system = dataConnector.getSystem()
    })

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<style>
	section {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
        height: 100%;
        width: 100%;
        background-color: rgb(20, 20, 20);
	}
    .container {
        display: flex;
		flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 400px;
        width: 600px;
    }
</style>
<section>
    <div class="container">
        {#key system}
            <DigimonViewer/>
            <PomodoroViewer/>
        {/key}
    </div>
</section>