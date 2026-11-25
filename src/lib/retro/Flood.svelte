<script lang="ts">
	import { browser } from '$app/env';
	import { onDestroy, onMount } from 'svelte';

	const MAX_LEVEL = 100;
	const TEXTURE_W = 314;
	const TEXTURE_H = 98;
	const RISE_RATE = 0.8;
	const RENDER_MS = 70;

	let svg = $state<SVGSVGElement | null>(null);
	let message = $state('');
	let audioReady = $state(false);

	let flush: HTMLAudioElement | null = null;
	let clunk: HTMLAudioElement | null = null;

	let level = 0;
	let renderedLevel = 0;
	let timer: ReturnType<typeof setInterval> | undefined;
	let drainAnimation: number | undefined;

	function messagesFor(l: number): string {
		if (l > 90) return 'This page is totaly submerged!';
		if (l > 70) return 'The page is deep under water!';
		if (l > 50) return "Oh my, there's flood on this page!";
		if (l > 30) return 'Goodness, this page has a major leak!';
		if (l > 10) return 'It looks like the page has a bad leak!';
		return 'This page has a harmless leak.';
	}

	function renderWater() {
		if (!svg) return;
		if (renderedLevel === level) return;

		const rising = level > renderedLevel;
		svg.style.top = MAX_LEVEL - level + '%';
		renderedLevel = level;
		message = rising ? 'The water level is rising...' : messagesFor(level);
	}

	function drain() {
		if (flush) {
			flush.currentTime = 0;
			void flush.play().catch(() => {});
		}
		cancelAnimationFrame(drainAnimation!);
		const from = level;
		const start = performance.now();
		const DRAIN_MS = 1600;
		const step = (now: number) => {
			const t = Math.min(1, (now - start) / DRAIN_MS);
			level = from * (1 - (1 - (1 - t) ** 3));
			renderWater();
			if (t < 1) drainAnimation = requestAnimationFrame(step);
			else level = 0;
		};
		drainAnimation = requestAnimationFrame(step);
	}

	onMount(() => {
		flush = new Audio('/retro/flood/flush.mp3');
		clunk = new Audio('/retro/flood/clunk.mp3');
		for (const a of [flush, clunk]) a.volume = 0.4;
		audioReady = true;

		if (svg) svg.style.top = MAX_LEVEL + '%';
		message = messagesFor(0);

		timer = setInterval(() => {
			level = Math.min(MAX_LEVEL, level + RISE_RATE * (RENDER_MS / 1000));
			renderWater();
		}, RENDER_MS);

		return () => clearInterval(timer);
	});

	onDestroy(() => {
		clearInterval(timer);
		if (browser) cancelAnimationFrame(drainAnimation!);
	});
</script>

<svg
	bind:this={svg}
	id="flood"
	class:visible={audioReady}
	viewBox="0 24 150 450"
	preserveAspectRatio="none"
	shape-rendering="auto"
	aria-hidden="true"
>
	<defs>
		<path
			id="gentle-wave"
			d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v450h-352z"
		></path>

		<pattern id="water" patternUnits="userSpaceOnUse" width={TEXTURE_W} height={TEXTURE_H}>
			<image href="/retro/flood/flood-water.png" x="0" y="0" width={TEXTURE_W} height={TEXTURE_H}
			></image>
		</pattern>
	</defs>
	<g class="retro-wave">
		<use href="#gentle-wave" x="48" y="0"></use>
		<use href="#gentle-wave" x="48" y="3"></use>
		<use href="#gentle-wave" x="48" y="5"></use>
	</g>
</svg>

{#if audioReady}
	<button id="flood-menu" onclick={drain} aria-label="Drain the water">
		<span id="flood-message">{message}</span>
	</button>
{/if}

<style>
	#flood {
		position: fixed;
		top: 100%;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 4000;
		display: none;
		cursor: url('/retro/flood/flood-water.png'), pointer;
	}
	#flood.visible {
		display: block;
	}
	#flood-menu {
		position: fixed;
		right: 0;
		bottom: 2.25rem;
		z-index: 4001;
		padding: 0.25rem 0.5rem;
		background: var(--face);
		border: 3px double #1e1e1e;
		color: var(--ink);
		font-family: var(--f-ui);
		font-size: 0.8125rem;
		cursor: var(--cur-pointer);
	}
	#flood-menu:hover {
		background: #00f3ff;
	}
	#flood-menu:active {
		box-shadow: var(--bevel-in);
	}

	.retro-wave :global(use) {
		animation: retro-slide 40s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
		fill: url('#water');
	}
	.retro-wave :global(use:nth-child(1)) {
		animation-delay: -2s;
		animation-duration: 14s;
	}
	.retro-wave :global(use:nth-child(2)) {
		animation-delay: -3s;
		animation-duration: 20s;
	}
	.retro-wave :global(use:nth-child(3)) {
		animation-delay: -5s;
		animation-duration: 40s;
	}

	@media (prefers-reduced-motion: reduce) {
		.retro-wave :global(use) {
			animation: none;
		}
	}
	@keyframes retro-slide {
		0% {
			transform: translate3d(-90px, 0, 0);
		}
		100% {
			transform: translate3d(85px, 0, 0);
		}
	}
</style>
