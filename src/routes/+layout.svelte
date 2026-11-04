<script lang="ts">
	import OnlineServer from '$lib/OnlineServer.svelte';
	import Header from './Header.svelte';
	import BadgeWall from '$lib/retro/BadgeWall.svelte';
	import RetroDivider from '$lib/retro/RetroDivider.svelte';
	import Retro from '$lib/retro/Retro.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
	const event = $derived(data.event);
	let retro = $derived(event.key == 'retro');
</script>

<svelte:head>
	<link rel="stylesheet" href="/{event.key}/styles.css" />
	{#if data.spaceImage}
		<link rel="preload" as="image" href={data.spaceImage.url} />
	{/if}
</svelte:head>

<div class="background" aria-hidden="true">
	{#if event.key === 'space' && data.spaceImage}
		<img src={data.spaceImage.url} alt="" fetchpriority="high" />
	{/if}
</div>
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
		{#if event.key === 'space' && data.spaceImage}
			<p class="space-credit">
				Background: <a href={data.spaceImage.sourceUrl} target="_blank" rel="noreferrer"
					>{data.spaceImage.title}</a
				>
				· {data.spaceImage.date} · {data.spaceImage.credit}
			</p>
		{/if}

		{#if retro}
			<RetroDivider />
			<BadgeWall />
		{/if}
	</footer>
</div>

{#if retro}
	<Retro />
{/if}
