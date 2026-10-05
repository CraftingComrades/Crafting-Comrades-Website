<script lang="ts">
	import { getWindows, toggleMinimize, focus, winRegistry } from './Win98Window.svelte';
	import StartMenu from './StartMenu.svelte';
	import { click98 } from './sound';

	let startOpen = $state(false);
	let clock = $state('');
	let taskbarEl = $state<HTMLElement>();

	const windows = $derived(getWindows());

	function tick() {
		const now = new Date();
		clock = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
	}

	$effect(() => {
		tick();
		const id = setInterval(tick, 15_000);
		return () => clearInterval(id);
	});
</script>

<svelte:window
	onclick={(e) => {
		if (startOpen && !taskbarEl?.contains(e.target as Node)) startOpen = false;
	}}
/>

<div bind:this={taskbarEl} class="taskbar">
	<StartMenu bind:open={startOpen} onlaunch={() => (startOpen = false)} />

	<div class="taskbar-tasks">
		{#each windows as win (win.id)}
			<button
				class="task-button"
				class:active={winRegistry.focusedId === win.id && !win.minimized}
				use:click98
				onclick={() => (win.minimized ? toggleMinimize(win.id) : focus(win.id))}
			>
				{#if win.icon}
					<img src="/retro/icons/{win.icon}" alt="" draggable="false" />
				{/if}
				<span>{win.label}</span>
			</button>
		{/each}
	</div>

	<div class="taskbar-tray">
		<span class="tray-icon">
			<img src="/retro/icons/loudspeaker_rays-0.png" alt="Volume" draggable="false" />
		</span>
		<span class="tray-clock">{clock}</span>
	</div>
</div>

<style>
	.taskbar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9000;
		display: flex;
		align-items: stretch;
		gap: 3px;
		height: 28px;
		padding: 2px;
		background: var(--face);
		box-shadow: var(--bevel-out-bold);
		user-select: none;
	}

	.taskbar-tasks {
		display: flex;
		flex: 1;
		gap: 3px;
		min-width: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.taskbar-tasks::-webkit-scrollbar {
		display: none;
	}

	.task-button {
		display: flex;
		align-items: center;
		gap: 3px;
		height: 22px;
		min-width: 0;
		max-width: 160px;
		padding: 0 4px;
		background: var(--face);
		border: none;
		box-shadow: var(--bevel-out);
		color: var(--ink);
		font-family: var(--f-ui);
		font-size: var(--font-size);
		cursor: var(--cur-pointer);
	}

	.task-button.active {
		box-shadow: var(--bevel-in);
		background-color: var(--face-light);
		font-weight: 700;
		padding: 1px 3px 0 5px;
	}

	.task-button img {
		width: 16px;
		height: 16px;
		flex: none;
	}

	.task-button span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.taskbar-tray {
		display: flex;
		align-items: center;
		gap: 3px;
		height: 22px;
		padding: 0 4px;
		background: var(--face);
		box-shadow: var(--bevel-in);
		flex: none;
	}

	.tray-icon img {
		display: block;
		width: 16px;
		height: 16px;
	}

	.tray-clock {
		min-width: 44px;
		text-align: center;
		font-size: var(--font-size);
	}
</style>
