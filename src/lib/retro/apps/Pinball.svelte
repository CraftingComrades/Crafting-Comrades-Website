<script lang="ts">
	import Win98Window from '../Win98Window.svelte';

	type Props = { onclose: () => void };
	let { onclose }: Props = $props();

	const CONTROLS = [
		['Z / LMB', 'Left Flipper'],
		['/ / RMB', 'Right Flipper'],
		['Space', 'Plunger'],
		['X', 'Left Bump'],
		['.', 'Right Bump'],
		['↑', 'Bottom Bump'],
	];
</script>

<Win98Window
	title="3D Pinball for Windows — Space Cadet"
	icon="pinball-32.png"
	width="fit-content"
	height="fit-content"
	{onclose}
>
	<iframe src="/retro/pinball/index.html" title="Pinball"></iframe>
	<div class="keymap">
		{#each CONTROLS as [key, action] (key)}
			<span><kbd>{key}</kbd><br />{action}</span>
		{/each}
	</div>
</Win98Window>

<style>
	iframe {
		display: block;
		width: 604px;
		max-width: 100%;
		height: auto;
		aspect-ratio: 604 / 444;
		border: none;
		background: #000;
	}

	.keymap {
		display: flex;
		justify-content: space-between;
		gap: 4px;
		width: 100%;
		border: 1px solid #494952;
		background: #242424;
		color: var(--white);
		font-family: monospace;
		font-size: 10px;
		padding: 0 4px;
	}
	kbd {
		text-shadow: 1px 1px 0 #000;
	}

	@media (max-width: 560px) {
		.keymap {
			flex-wrap: wrap;
		}
	}
</style>
