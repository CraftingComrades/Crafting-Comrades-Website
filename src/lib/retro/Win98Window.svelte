<script lang="ts" module>
	export type WinInstance = {
		id: string;
		label: string;
		icon: string;
		zIndex: number;
		minimized: boolean;
	};

	let _windows = $state<WinInstance[]>([]);
	let _positions = $state<Record<string, { x: number; y: number }>>({});
	let _nextZ = 10;
	let _counter = 0;
	let _cascade = 0;

	export const winRegistry = $state({ focusedId: null as string | null });

	export function getWindows(): WinInstance[] {
		return _windows;
	}

	function _register(label: string, icon: string): string {
		const id = `win98-${++_counter}`;
		const step = (_cascade % 6) * 28;
		_cascade++;
		_positions = {
			..._positions,
			[id]: { x: step, y: step },
		};
		_nextZ += 20;
		_windows = [..._windows, { id, label, icon, zIndex: _nextZ, minimized: false }];
		winRegistry.focusedId = id;
		return id;
	}

	function _unregister(id: string) {
		_windows = _windows.filter((w) => w.id !== id);
		const { [id]: _removed, ...rest } = _positions;
		_positions = rest;
		if (winRegistry.focusedId === id) {
			winRegistry.focusedId = _windows.length > 0 ? _windows[_windows.length - 1].id : null;
		}
	}

	export function setPosition(id: string, x: number, y: number) {
		_positions = { ..._positions, [id]: { x, y } };
	}

	export function focus(id: string) {
		const win = _windows.find((w) => w.id === id);
		if (!win) return;
		_nextZ += 20;
		win.minimized = false;
		win.zIndex = _nextZ;
		winRegistry.focusedId = id;
	}

	export function toggleMinimize(id: string) {
		const win = _windows.find((w) => w.id === id);
		if (!win) return;
		const minimized = !win.minimized;
		_windows = _windows.map((w) => (w.id === id ? { ...w, minimized } : w));
		if (minimized && winRegistry.focusedId === id) {
			const rest = _windows.filter((w) => !w.minimized && w.id !== id);
			winRegistry.focusedId = rest.length ? rest[rest.length - 1].id : null;
		}
	}

	export function closeWindow(id: string) {
		if (!_windows.some((w) => w.id === id)) return;
		_unregister(id);
	}
</script>

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import MenuBar, { type MenuBarItem } from './MenuBar.svelte';
	import { click98, playSound } from './sound';

	type Props = {
		windowId?: string;
		title: string;
		icon?: string;
		width?: string;
		height?: string;
		onclose?: () => void;
		onscroll?: (event: Event) => void;
		menubar?: MenuBarItem[];
		children: Snippet;
		statusbar?: Snippet;
		bevelIn?: boolean;
		hideClose?: boolean;
		style?: string;
	};

	let {
		windowId = $bindable(''),
		title,
		icon = '',
		width = '700px',
		height = 'auto',
		onclose = () => void 0,
		onscroll = () => void 0,
		menubar,
		children,
		statusbar,
		bevelIn = false,
		hideClose = false,
		style = '',
	}: Props = $props();

	let el: HTMLDivElement | undefined = $state();
	let dragging = $state(false);

	let x = $derived(_positions[windowId]?.x ?? 0);
	let y = $derived(_positions[windowId]?.y ?? 0);
	let positioned = $derived(_positions[windowId] !== undefined);

	let instance = $derived(_windows.find((w) => w.id === windowId));
	let zIndex = $derived(instance?.zIndex ?? _nextZ);
	let minimized = $derived(instance?.minimized ?? false);
	let focused = $derived(winRegistry.focusedId === windowId);

	let startPx = 0;
	let startPy = 0;

	function onPointerDown(e: PointerEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		focus(windowId);
		dragging = true;
		startPx = e.clientX - x;
		startPy = e.clientY - y;
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerUp);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging || !el) return;
		const rect = el.getBoundingClientRect();
		const MIN_VISIBLE = 60;
		const vh = (document.getElementById('win-container')?.clientHeight ??
			window.innerHeight) as number;
		const newX = Math.min(
			window.innerWidth - MIN_VISIBLE,
			Math.max(MIN_VISIBLE - rect.width, e.clientX - startPx),
		);
		const newY = Math.min(vh - MIN_VISIBLE * 2, Math.max(0, e.clientY - startPy));
		setPosition(windowId, newX, newY);
	}

	function onPointerUp() {
		dragging = false;
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
	}

	function doMinimize() {
		playSound('warning', 0.35);
		toggleMinimize(windowId);
	}

	function doClose() {
		playSound('clickDown', 0.35);
		onclose();
	}

	onMount(() => {
		windowId = _register(title, icon);
		return () => _unregister(windowId);
	});
</script>

<div
	bind:this={el}
	class="win98-window"
	class:hidden-window={!positioned || minimized}
	class:dragging
	style:z-index={zIndex}
	style:width
	style:height
	style:left={x + 'px'}
	style:top={y + 'px'}
	{style}
	onpointerdown={() => focus(windowId)}
	role="presentation"
>
	<div>
		<div
			class="titlebar"
			class:inactive={!focused}
			onpointerdown={onPointerDown}
			role="presentation"
		>
			{#if icon}
				<img class="titlebar-icon" src="/retro/icons/{icon}" alt="" draggable="false" />
			{/if}
			<span class="titlebar-text">{title}</span>
			<div class="titlebar-buttons">
				<button class="caption-button" use:click98 onclick={doMinimize} aria-label="Minimize">
					<img draggable="false" src="/retro/glyphs/minimize.png" alt="" />
				</button>

				{#if !hideClose}
					<button class="caption-button close" use:click98 onclick={doClose} aria-label="Close">
						<img draggable="false" src="/retro/glyphs/close.png" alt="" />
					</button>
				{/if}
			</div>
		</div>
		{#if menubar}
			<MenuBar items={menubar} />
		{/if}
	</div>

	<div class="win98-body" class:beveled={bevelIn} {onscroll}>
		{@render children()}
	</div>

	{#if statusbar}
		<div class="win98-statusbar">{@render statusbar()}</div>
	{/if}
</div>

<style>
	.win98-window {
		position: absolute;
		display: flex;
		flex-direction: column;
		background: var(--face);
		box-shadow: var(--bevel-window);
		max-height: 100%;
		max-width: 100%;
		padding: 3px;
	}

	.win98-window.hidden-window {
		display: none;
	}

	.win98-window.dragging {
		cursor: var(--cur-grab);
	}

	.titlebar {
		display: flex;
		flex: none;
		align-items: center;
		gap: 2px;
		height: 18px;
		padding: 2px;
		background: linear-gradient(90deg, var(--titlebar-a), var(--titlebar-b));
		color: var(--white);
		cursor: var(--cur-grab);
		user-select: none;
	}

	.titlebar.inactive {
		background: linear-gradient(90deg, var(--titlebar-inactive-a), var(--titlebar-inactive-b));
	}

	.titlebar-icon {
		width: 16px;
		height: 16px;
		flex: none;
		pointer-events: none;
	}

	.titlebar-text {
		flex: 1;
		overflow: hidden;
		margin-right: 4px;
		font-size: var(--font-size);
		font-weight: 700;
		line-height: 12px;
		text-overflow: ellipsis;
		white-space: nowrap;
		pointer-events: none;
	}

	.titlebar-buttons {
		display: flex;
		gap: 2px;
		flex: none;
	}

	.caption-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 14px;
		flex: none;
		background: var(--face);
		border: none;
		box-shadow: var(--bevel-out);
		cursor: var(--cur-pointer);
		padding: 0;
	}

	.caption-button:active:not(:disabled) {
		box-shadow: var(--bevel-in);
	}

	.caption-button.close {
		margin-left: 4px;
	}

	.caption-button:disabled {
		cursor: default;
	}

	.caption-button img {
		display: block;
		width: 13px;
		height: 11px;
		image-rendering: pixelated;
	}

	.caption-button:disabled img {
		filter: invert(1) brightness(0.5);
	}

	.win98-body {
		position: relative;
		display: flex;
		flex: 1;
		flex-direction: column;
		min-height: 0;
		margin: 2px;
		background: var(--face);
		overflow-y: auto;
	}

	.win98-body.beveled {
		box-shadow: var(--bevel-in);
	}

	.win98-statusbar {
		display: flex;
		flex: none;
		gap: 2px;
		margin: 2px;
		background: var(--face);
	}

	.win98-statusbar :global(> *) {
		flex: 1;
		padding: 1px 3px;
		box-shadow: var(--bevel-flat);
	}
</style>
