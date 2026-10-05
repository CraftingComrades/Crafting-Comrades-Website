<script lang="ts">
	import { onMount } from 'svelte';
	import { isOpen, RETRO_APPS, shutdown } from './apps.svelte';
	import Taskbar from './Taskbar.svelte';
	import Flood from './Flood.svelte';
	import PixelCat from './PixelCat.svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<div id="win-container" class="win-container">
	{#if mounted}
		{#each RETRO_APPS as app (app.id)}
			{#if isOpen(app.id)}
				<app.component onclose={() => shutdown(app.id)} />
			{/if}
		{/each}
	{/if}
</div>

<Taskbar />

<Flood />

<PixelCat />

<style>
	.win-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 2rem;
		z-index: 100;
		overflow: hidden;
		pointer-events: none;
	}
	.win-container :global(.win98-window) {
		pointer-events: auto;
	}
</style>
