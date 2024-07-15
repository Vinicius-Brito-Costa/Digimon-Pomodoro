<script>
	import '../app.css';
</script>

<main>
    <slot />
</main>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: row;
		width: 100vw;
        height: 100vh;
		margin: 0;
		box-sizing: border-box;
	}

</style>
