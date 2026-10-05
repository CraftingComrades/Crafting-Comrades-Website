<script lang="ts">
	import { onMount } from 'svelte';

	let host = $state<HTMLElement | null>(null);

	onMount(async () => {
		if (!host) return;
		const { neko } = await import('onekojs');
		neko({
			element: host,
			x: 40,
			y: Math.max(40, window.innerHeight - 120),
			speed: 10,
		});
	});
</script>

<div bind:this={host} class="pixel-cat" aria-hidden="true"></div>

<style>
	.pixel-cat {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 4500;
		pointer-events: none;
		image-rendering: pixelated;
	}
</style>
