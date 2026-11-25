<script lang="ts">
	import { resolve } from '$app/paths';
	import type { SiteEvent } from '#lib/events.ts';

	interface Props {
		event: SiteEvent;
	}

	let { event }: Props = $props();
</script>

<header>
	<!-- Header with banner & nav buttons for modpacks / servers / TBD -->
	<div class="banner">
		<img src="/{event.key}/banner.png" alt="Banner" class="banner" />
	</div>
	{#if event.key == 'retro'}
		<div class="banner-progress">
			<span class="banner-progress-label">
				Downloading banner&hellip;
				<span class="banner-progress-done">Ready.</span>
			</span>
			<div class="banner-progress-well">
				<div class="banner-progress-fill"></div>
			</div>
		</div>
	{/if}
	<nav>
		<a href={resolve('/modpacks')}>{event.tabs.modpacks}</a>
		<a href={resolve('/worlds')}>{event.tabs.worlds}</a>
		<a href={resolve('/map')}>{event.tabs.map}</a>
		<a href={resolve('/about')}>{event.tabs.about}</a>
		<a href={resolve('/services')}>{event.tabs.services}</a>
		<a href={resolve('/tmp-files')}>{event.tabs.tmpFiles}</a>
	</nav>
</header>

<style>
	header {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	nav {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
	}
	nav a {
		text-align: center;
		text-decoration: none;
		max-width: 10rem;
		width: 100%;
		background-color: var(--color-nav-bg);
		border: 1px solid var(--color-nav-border);
		border-radius: 0.25rem;
		padding: 0.5rem 1rem;
		margin: 0.5rem;
		box-shadow: var(--color-nav-shadow);
		transition: all 0.2s ease-in-out;
	}
	nav a:hover {
		border: 1px solid var(--color-nav-hover-border);
	}
</style>
