<script lang="ts">
	import { onMount } from 'svelte';
	import Win98Window from '../Win98Window.svelte';
	import type { MenuBarItem } from '../MenuBar.svelte';
	import AboutBox from './AboutBox.svelte';

	type Props = { onclose: () => void };
	let { onclose }: Props = $props();

	let showAbout = $state(false);
	let audioEl = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);

	const DANCE = [
		'anin.gif',
		'anin.gif',
		'anin.gif',
		'hamu.gif',
		'hamu.gif',
		'hamu.gif',
		'hamu.gif',
		'hamu.gif',
		'hamu.gif',
		'hamu.gif',
		'anin.gif',
		'anin.gif',
		'anin.gif',
		'gerbil.gif',
		'gerbil.gif',
		'gerbil.gif',
		'gerbil.gif',
		'gerbil.gif',
		'gerbil.gif',
		'gerbil.gif',
		'anin.gif',
		'anin.gif',
		'anin.gif',
		'hamwalk.gif',
		'hamwalk.gif',
		'hamwalk.gif',
		'hamwalk.gif',
		'hamwalk.gif',
		'hamwalk.gif',
		'hamwalk.gif',
		'hamwalk.gif',
	];

	type Row = { src: string; id: number }[];
	let nextId = 0;

	function createRow(withNyancat: boolean): Row {
		const row: Row = [];
		const nyancatSlot = Math.floor(DANCE.length * Math.random());
		for (let i = 0; i < DANCE.length; i++) {
			if (withNyancat && i === nyancatSlot) {
				row.push({ src: '/retro/hampster/nyan.gif', id: nextId++ });
			} else {
				row.push({ src: `/retro/hampster/${DANCE[i]}`, id: nextId++ });
			}
		}
		return row;
	}

	let rows = $state<Row>([
		...createRow(false),
		...createRow(false),
		...createRow(false),
		...createRow(false),
	]);

	const menubar: MenuBarItem[] = [
		{
			label: 'File',
			children: [
				{ label: 'New Window', disabled: true },
				{ separator: true },
				{ label: 'Exit', onclick: () => onclose() },
			],
		},
		{
			label: 'Help',
			children: [{ label: 'About HampsterDance', onclick: () => (showAbout = true) }],
		},
	];

	function startAudio() {
		if (playing || !audioEl) return;
		audioEl.currentTime = 0;
		void audioEl.play().then(
			() => (playing = true),
			() => {},
		);
	}

	onMount(() => {
		window.addEventListener('pointerdown', startAudio);
		window.addEventListener('keydown', startAudio);
		return () => {
			window.removeEventListener('pointerdown', startAudio);
			window.removeEventListener('keydown', startAudio);
		};
	});

	function handleScroll(event: Event) {
		const el = event.currentTarget as HTMLElement;
		if (!el) return;
		if ((el.scrollHeight - el.scrollTop) / 2 < el.clientHeight) {
			rows = [...rows, ...createRow(el.scrollTop > 10_000)];
		}
	}
</script>

<Win98Window title="HampsterDance" icon="hampster-icon-32.gif" width="480px" {menubar} {onclose}>
	<audio bind:this={audioEl} loop preload="auto" src="/retro/hampster/originaldedodedo.wav">
	</audio>

	<div class="dance" onscroll={handleScroll}>
		<div class="dance-rows">
			{#each rows as hamster (hamster.id)}
				<img src={hamster.src} alt="" draggable="false" />
			{/each}
		</div>
	</div>
</Win98Window>

{#if showAbout}
	<AboutBox
		title="About HampsterDance"
		icon="hampster-icon-32.gif"
		heading="HampsterDance"
		subheading="Version 1.0"
		lines={['The original internet meme, reborn.', 'Scroll down for more hamsters!']}
		onclose={() => (showAbout = false)}
	/>
{/if}

<style>
	.dance {
		flex: 1;
		overflow-y: auto;
		background: var(--white);
		padding: 1rem;
	}
	.dance-rows {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
	}
	.dance-rows img {
		margin-bottom: 0.5rem;
	}
</style>
