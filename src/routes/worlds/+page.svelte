<script lang="ts">
	import type { PageData } from './$types';
	import World from './World.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Worlds | Crafting Comrades</title>
</svelte:head>

<div class="worlds-list">
	{#each data.worlds as world}
		<World {world} />
	{/each}
	{#if data.worlds.length === 0}
		<p>Nothing is here yet...</p>
	{/if}
</div>

<style>
	.worlds-list {
		display: flex;
		align-items: center;
		flex-direction: column;
        width: 100%;
	}
</style>
