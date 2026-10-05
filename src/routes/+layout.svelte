<script lang="ts">
	import OnlineServer from '$lib/OnlineServer.svelte';
	import Header from './Header.svelte';
	import BadgeWall from '$lib/retro/BadgeWall.svelte';
	import RetroDivider from '$lib/retro/RetroDivider.svelte';
	import Retro from '$lib/retro/Retro.svelte';
	import { getCurrentEvent } from '$lib/events';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	const event = $derived(getCurrentEvent());
	let retro = $derived(event.key == 'retro');
</script>

<svelte:head>
	<link rel="stylesheet" href="/{event.key}/styles.css" />
</svelte:head>

<div class="background"></div>
<div class="app">
	<Header {event} />

	{#if retro}
		<RetroDivider />
	{/if}

	<main>
		<OnlineServer />
		{@render children?.()}
	</main>

	<footer>
		<p>{event.copyright}</p>

		{#if retro}
			<RetroDivider />
			<BadgeWall />
		{/if}
	</footer>
</div>

{#if retro}
	<Retro />
{/if}
