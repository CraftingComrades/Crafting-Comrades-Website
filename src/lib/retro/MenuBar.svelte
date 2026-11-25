<script lang="ts">
	import { click98 } from './sound';

	export type MenuBarChild = {
		label?: string;
		onclick?: () => void;
		icon?: string;
		disabled?: boolean;
		separator?: boolean;
	};

	export type MenuBarItem = {
		label: string;
		children?: MenuBarChild[];
	};

	let { items }: { items: MenuBarItem[] } = $props();

	let openMenu = $state<string | null>(null);
	let barEl = $state<HTMLDivElement | undefined>();

	function toggleMenu(label: string) {
		openMenu = openMenu === label ? null : label;
	}

	function handleEnter(label: string) {
		if (openMenu !== null) openMenu = label;
	}

	function handleItemClick(child: MenuBarChild) {
		if (child.disabled || child.separator) return;
		child.onclick?.();
		openMenu = null;
	}

	function handleWindowClick(e: MouseEvent) {
		if (openMenu === null) return;
		if (barEl?.contains(e.target as Node)) return;
		openMenu = null;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (openMenu === null) return;
		if (e.key === 'Escape') {
			openMenu = null;
			e.preventDefault();
		}
	}
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeyDown} />

<div bind:this={barEl} class="menu-bar" role="menubar">
	{#each items as item, i (i)}
		<div class="menu-root">
			<button
				class="menu-top"
				class:open={openMenu === item.label}
				use:click98
				onclick={() => toggleMenu(item.label)}
				onpointerenter={() => handleEnter(item.label)}
				role="menuitem"
				aria-haspopup={item.children?.length ? 'true' : undefined}
				aria-expanded={openMenu === item.label || undefined}
			>
				{item.label}
			</button>
			{#if openMenu === item.label && item.children?.length}
				<div class="menu-drop" role="menu">
					{#each item.children as child, j (j)}
						{#if child.separator}
							<div class="sep"></div>
						{:else}
							<button
								class="menu-item"
								class:with-icon={!!child.icon}
								role="menuitem"
								disabled={child.disabled}
								onclick={() => handleItemClick(child)}
								use:click98
							>
								{#if child.icon}
									<img src="/retro/icons/{child.icon}" alt="" class="menu-icon" />
								{/if}
								<span class="menu-label">
									<span class="hotkey">{child.label?.[0]}</span>{child.label?.slice(1)}
								</span>
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.menu-bar {
		display: flex;
		height: 18px;
		background: var(--face);
		user-select: none;
	}
	.menu-root {
		position: relative;
	}
	.menu-top {
		display: flex;
		align-items: center;
		height: 18px;
		background: var(--face);
		border: none;
		color: var(--ink);
		cursor: var(--cur-pointer);
		font-family: var(--f-ui);
		font-size: var(--font-size);
		padding: 0 4px;
	}
	.menu-top:hover,
	.menu-top.open {
		background: var(--titlebar-a);
		color: var(--white);
	}
	.menu-drop {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 60;
		display: flex;
		flex-direction: column;
		min-width: 120px;
		background: var(--face);
		box-shadow: var(--bevel-out-bold);
		padding: 2px;
	}
	.menu-item {
		display: flex;
		align-items: center;
		gap: 4px;
		width: 100%;
		height: 18px;
		padding: 0 24px 0 24px;
		background: none;
		border: none;
		color: var(--ink);
		cursor: var(--cur-pointer);
		font-family: var(--f-ui);
		font-size: var(--font-size);
		text-align: left;
		white-space: nowrap;
	}
	.menu-item.with-icon {
		padding-left: 4px;
	}
	.menu-item:hover:not(:disabled) {
		background: var(--titlebar-a);
		color: var(--white);
	}
	.menu-item:disabled {
		color: var(--shadow);
		text-shadow: 1px 1px 0 var(--white);
		cursor: default;
	}
	.menu-icon {
		width: 16px;
		height: 16px;
		flex: none;
	}
	.menu-label {
		flex: 1;
	}
	.hotkey {
		text-decoration: underline;
	}
	.sep {
		height: 1px;
		background: var(--shadow);
		box-shadow: 0 1px 0 var(--white);
		margin: 2px 1px;
		flex-shrink: 0;
	}
</style>
