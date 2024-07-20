<script lang="ts">
    import CookieConsent from "../lib/CookieConsent.svelte";
    import Main from "../lib/Main.svelte";
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
</style>
<section>
    <CookieConsent>
        <Main></Main>
    </CookieConsent>
    <div class="noise-filter"></div>
</section>