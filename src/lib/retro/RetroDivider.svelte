<script lang="ts">
	import { onMount } from 'svelte';

	export const DIVIDERS: { file: string; credit: string }[] = [
		{ file: 'strawberrypixel.gif', credit: 'strawberrypixel' },
		{ file: 'rainbowclouds.png', credit: 'rainbowclouds' },
		{ file: 'starsquish.gif', credit: 'starsquish' },
		{ file: 'colorfulstarfloat.gif', credit: 'colorfulstarfloat' },
		{ file: 'apple.gif', credit: 'apple' },
		{ file: 'mushrooms_blue.gif', credit: 'mushrooms_blue' },
		{ file: 'crayons.gif', credit: 'crayons' },
		{ file: 'pencil.png', credit: 'pencil' },
		{ file: 'grass.png', credit: 'grass' },
		{ file: 'neighborhood.png', credit: 'neighborhood' },
		{ file: 'bubbles.gif', credit: 'bubbles' },
		{ file: 'nautical.png', credit: 'nautical' },
	];

	let file = $state<string | null>(null);

	onMount(() => {
		const pick = DIVIDERS[Math.floor(Math.random() * DIVIDERS.length)];
		if (pick) file = pick.file;
	});
</script>

{#if file}
	<div class="divider">
		<img src="/retro/dividers/{file}" alt="" />
	</div>
{/if}
