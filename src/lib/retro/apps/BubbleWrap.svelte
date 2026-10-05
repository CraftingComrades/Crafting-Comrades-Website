<script lang="ts">
	import Win98Window from '../Win98Window.svelte';
	import type { MenuBarItem } from '../MenuBar.svelte';
	import AboutBox from './AboutBox.svelte';

	type Props = { onclose: () => void };
	let { onclose }: Props = $props();

	let showAbout = $state(false);
	let poppedCount = $state(0);
	let totalCount = $state(0);
	let gridEl = $state<HTMLDivElement>();
	let audioContext: AudioContext | null = null;
	let audioBuffer: AudioBuffer | null = null;

	const BUBBLE_SIZE = 20;
	const BUBBLE_GAP = 1;
	let refresh = $state(0);

	const menubar: MenuBarItem[] = [
		{
			label: 'File',
			children: [
				{ label: 'New Sheet', onclick: () => (refresh += totalCount + 1) },
				{ separator: true },
				{ label: 'Exit', onclick: () => onclose() },
			],
		},
		{
			label: 'Help',
			children: [{ label: 'About Bubble Wrap', onclick: () => (showAbout = true) }],
		},
	];

	function initAudio() {
		if (audioContext) return;
		audioContext = new AudioContext();
		fetch('/retro/sounds/bubble.mp3')
			.then((r) => r.arrayBuffer())
			.then((buf) => audioContext!.decodeAudioData(buf))
			.then((decoded) => (audioBuffer = decoded))
			.catch(() => {});
	}

	function playPop() {
		if (!audioContext || !audioBuffer) return;
		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.playbackRate.value = Math.random() * 3 + 0.25;
		source.connect(audioContext.destination);
		source.start(0);
	}

	function popBubble(btn: HTMLButtonElement) {
		if (btn.dataset.popped === 'true') return;
		btn.dataset.popped = 'true';
		playPop();
		poppedCount++;
	}

	function handleMouseInteraction(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const btn = target.closest('button');
		if (btn) popBubble(btn);
	}

	function generateGrid() {
		if (!gridEl) return;
		const container = gridEl.parentElement;
		if (!container) return;
		const cols = Math.floor(container.clientWidth / (BUBBLE_SIZE + BUBBLE_GAP));
		const rows = Math.floor(container.clientHeight / (BUBBLE_SIZE + BUBBLE_GAP));
		const next = Math.max(0, cols * rows);
		if (next === totalCount) return;
		totalCount = next;
		poppedCount = 0;
		initAudio();
	}

	function onGridMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;
		handleMouseInteraction(e);
	}

	function onGridMouseMove(e: MouseEvent) {
		if (e.buttons !== 1) return;
		handleMouseInteraction(e);
	}

	function preventContextMenu(e: MouseEvent) {
		e.preventDefault();
	}

	$effect(() => {
		const el = gridEl;
		if (!el) return;
		generateGrid();
		const observer = new ResizeObserver(generateGrid);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<Win98Window title="Bubble Wrap" icon="bubbles-icon-32.png" width="34rem" {menubar} {onclose}>
	<div class="sheet">
		<div
			bind:this={gridEl}
			class="grid-area"
			role="cell"
			tabindex="-1"
			onmousedown={onGridMouseDown}
			onmousemove={onGridMouseMove}
			oncontextmenu={preventContextMenu}
		>
			<div
				class="bubble-grid"
				style="grid-template-columns: repeat(auto-fill, {BUBBLE_SIZE}px); gap: {BUBBLE_GAP}px;"
			>
				{#each { length: totalCount } as _, i (i + refresh)}
					<button
						class="bubble"
						style="width: {BUBBLE_SIZE}px; height: {BUBBLE_SIZE}px;"
						aria-pressed="false"
						aria-label="Bubble"
					></button>
				{/each}
			</div>
		</div>
	</div>

	{#snippet statusbar()}
		<div class="status-cell">{poppedCount} / {totalCount} popped</div>
	{/snippet}
</Win98Window>

{#if showAbout}
	<AboutBox
		title="About Bubble Wrap"
		icon="bubbles-icon-32.png"
		heading="Bubble Wrap"
		subheading="Version 1.0"
		lines={['The world’s most satisfying stress relief.', 'Click and drag to pop bubbles!']}
		onclose={() => (showAbout = false)}
	/>
{/if}

<style>
	.sheet {
		display: flex;
		flex-direction: column;
		height: 20rem;
		overflow: hidden;
	}
	.grid-area {
		flex: 1;
		overflow: hidden;
		background: var(--face);
		padding: 0.25rem;
	}
	.bubble-grid {
		display: grid;
	}
	.bubble {
		background: var(--face);
		border: none;
		box-shadow: var(--bevel-out);
		padding: 0;
		cursor: var(--cur-pointer);
	}
	.bubble:global([data-popped='true']) {
		background: var(--face-light);
		box-shadow: var(--bevel-in);
	}
	.status-cell {
		background: var(--face);
		box-shadow: var(--bevel-in);
		padding: 0.125rem 0.5rem;
	}
</style>
