<script lang="ts">
	import OnlineServer from '$lib/OnlineServer.svelte';
	import Header from './Header.svelte';
	import { getCurrentEvent } from '$lib/events';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	const event = getCurrentEvent();
</script>

<svelte:head>
	<link rel="stylesheet" href="/{event.key}/styles.css" />
</svelte:head>

<div class="background"></div>
<div class="app">
	<Header />

	<main>
		<OnlineServer />
		{@render children?.()}
	</main>

	<footer>
		<p>{event.copyright}</p>
	</footer>
</div>
