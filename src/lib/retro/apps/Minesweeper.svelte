<script lang="ts">
	import Win98Window from '../Win98Window.svelte';
	import type { MenuBarItem } from '../MenuBar.svelte';
	import AboutBox from './AboutBox.svelte';

	type Props = { onclose: () => void };
	let { onclose }: Props = $props();

	let showAbout = $state(false);

	const COLS = 8;
	const ROWS = 8;
	const TOTAL_BOMBS = 10;

	const CELL = 20;
	const WINDOW_W = COLS * CELL + 4 + 6 + 4 + 6;

	let board = $state<boolean[][]>([]);
	let clickedPos = $state<[number, number] | null>(null);
	let mouseDown = $state(false);

	const menubar: MenuBarItem[] = [
		{
			label: 'File',
			children: [
				{ label: 'New Game', onclick: resetGame },
				{ separator: true },
				{ label: 'Exit', onclick: () => onclose() },
			],
		},
		{
			label: 'Help',
			children: [{ label: 'About Minesweeper', onclick: () => (showAbout = true) }],
		},
	];

	function makeEmptyBoard(): boolean[][] {
		return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => false));
	}

	function placeBomb(b: boolean[][], x: number, y: number) {
		if (b[y][x]) return false;
		b[y][x] = true;
		return true;
	}

	function initBoard() {
		const b = makeEmptyBoard();
		for (let i = 0; i < TOTAL_BOMBS - 1; i++) {
			for (;;) {
				const x = Math.floor(Math.random() * COLS);
				const y = Math.floor(Math.random() * ROWS);
				if (placeBomb(b, x, y)) break;
			}
		}
		return b;
	}

	function cellSrc(x: number, y: number): string {
		const cell = board[y]?.[x];
		if (clickedPos && cell) {
			return clickedPos[0] === x && clickedPos[1] === y
				? '/retro/minesweeper/bombdeath.gif'
				: '/retro/minesweeper/bombrevealed.gif';
		}
		return '/retro/minesweeper/blank.gif';
	}

	function faceSrc(): string {
		if (clickedPos) return '/retro/minesweeper/facedead.gif';
		if (mouseDown) return '/retro/minesweeper/faceooh.gif';
		return '/retro/minesweeper/facesmile.gif';
	}

	function handleClick(x: number, y: number) {
		if (clickedPos) return;
		placeBomb(board, x, y);
		clickedPos = [x, y];
	}

	function resetGame() {
		clickedPos = null;
		mouseDown = false;
		board = initBoard();
	}

	resetGame();
</script>

<Win98Window title="Minesweeper" icon="executable-0.png" width="{WINDOW_W}px" {menubar} {onclose}>
	<div class="frame">
		<div
			class="hud"
			onmousedown={() => (mouseDown = true)}
			onmouseup={() => (mouseDown = false)}
			role="presentation"
		>
			<div class="counter">
				<img src="/retro/minesweeper/time0.gif" alt="" draggable="false" />
				<img src="/retro/minesweeper/time1.gif" alt="" draggable="false" />
				<img src="/retro/minesweeper/time0.gif" alt="" draggable="false" />
			</div>
			<button class="face" onclick={resetGame} aria-label="Restart">
				<img src={faceSrc()} alt="Restart" draggable="false" />
			</button>
			<div class="counter">
				<img src="/retro/minesweeper/time0.gif" alt="" draggable="false" />
				<img src="/retro/minesweeper/time0.gif" alt="" draggable="false" />
				<img src="/retro/minesweeper/time0.gif" alt="" draggable="false" />
			</div>
		</div>

		<div class="board">
			{#each { length: ROWS } as _, y (y)}
				<div class="board-row">
					{#each { length: COLS } as _, x (x)}
						<button class="cell" onclick={() => handleClick(x, y)} aria-label={`Cell ${x},${y}`}>
							<img src={cellSrc(x, y)} alt="" draggable="false" />
						</button>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</Win98Window>

{#if showAbout}
	<AboutBox
		title="About Minesweeper"
		icon="executable-0.png"
		heading="Minesweeper"
		subheading="Troll Mode Edition"
		lines={['Your first click is always a bomb.', 'Good luck! ;)']}
		onclose={() => (showAbout = false)}
	/>
{/if}

<style>
	.frame {
		display: inline-block;
		align-self: flex-start;
		background: var(--face);
		box-shadow: var(--bevel-out);
		padding: 3px;
		line-height: 1;
	}

	.hud {
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: var(--bevel-in);
		padding: 2px;
		margin-bottom: 2px;
	}

	.counter {
		display: flex;
		background: #000;
		padding: 1px;
	}

	.counter img {
		display: block;
		width: 16px;
		height: 29px;
		image-rendering: pixelated;
	}

	.face {
		display: block;
		width: 33px;
		height: 33px;
		background: var(--face);
		border: none;
		box-shadow: var(--bevel-out);
		cursor: var(--cur-pointer);
		padding: 0;
	}

	.face:active {
		box-shadow: var(--bevel-in);
	}

	.face img {
		display: block;
		width: 33px;
		height: 33px;
		image-rendering: pixelated;
		pointer-events: none;
	}

	.board {
		width: fit-content;
		box-shadow: var(--bevel-in);
		padding: 2px;
	}

	.board-row {
		display: flex;
	}

	.cell {
		display: block;
		width: 20px;
		height: 20px;
		background: transparent;
		border: none;
		padding: 0;
		cursor: var(--cur-pointer);
	}

	.cell img {
		display: block;
		width: 20px;
		height: 20px;
		image-rendering: pixelated;
	}
</style>
