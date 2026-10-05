<script lang="ts">
	import { goto } from '$app/navigation';
	import { click98, playSound } from './sound';
	import { isOpen, launch, RETRO_APPS, RETRO_LINKS, type RetroApp } from './apps.svelte';

	type Props = {
		open?: boolean;
		onlaunch?: () => void;
	};

	let { open = $bindable(false), onlaunch = () => {} }: Props = $props();

	let anchorEl = $state<HTMLElement>();

	function openApp(app: RetroApp) {
		launch(app.id);
		playSound('startup', 0.4);
		onlaunch();
	}

	function openLink(href: string) {
		playSound('clickDown', 0.4);
		onlaunch();
		void goto(href);
	}

	function handleWindowClick(e: MouseEvent) {
		if (!open) return;
		if (anchorEl?.contains(e.target as Node)) return;
		open = false;
	}
</script>

<svelte:window onclick={handleWindowClick} />

<div bind:this={anchorEl} class="start-anchor">
	<button
		class="w98-button start-button"
		class:open
		use:click98
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-haspopup="menu"
	>
		<img src="/retro/icons/windows-4.png" alt="" draggable="false" />
		<span>Start</span>
	</button>

	{#if open}
		<div class="start-menu" role="menu">
			<div class="start-identity">
				<img class="start-avatar" src="/retro/icons/msagent-3.png" alt="" draggable="false" />
				<span class="start-username">CraftingComrades</span>
			</div>

			<div class="start-body">
				<div class="start-apps">
					{#each RETRO_APPS as app (app.id)}
						<button class="start-item" role="menuitem" use:click98 onclick={() => openApp(app)}>
							<img src="/retro/icons/{app.icon}" alt="" draggable="false" />
							<span class="start-item-text">
								<span class="start-item-label">
									<span class="hotkey">{app.label[0]}</span>{app.label.slice(1)}
								</span>
								{#if isOpen(app.id)}
									<span class="start-item-note">Already running</span>
								{/if}
							</span>
						</button>
					{/each}
				</div>

				<div class="sep"></div>

				<div class="start-apps">
					{#each RETRO_LINKS as link (link.href)}
						<button
							class="start-item"
							role="menuitem"
							use:click98
							onclick={() => openLink(link.href)}
						>
							<img src="/retro/icons/{link.icon}" alt="" draggable="false" />
							<span class="start-item-text">
								<span class="start-item-label">{link.label}</span>
							</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.start-anchor {
		position: relative;
		flex: none;
	}

	.start-button {
		height: 22px;
		padding: 0 4px;
		gap: 3px;
		font-weight: 700;
	}
	.start-button img {
		width: 16px;
		height: 16px;
		flex: none;
	}

	.start-menu {
		position: absolute;
		bottom: calc(100% + 2px);
		left: 0;
		z-index: 9500;
		display: grid;
		grid-template-columns: 21px 1fr;
		width: 180px;
		background: var(--face);
		box-shadow: var(--bevel-out-bold);
		padding: 2px;
	}

	.start-identity {
		grid-row: 1 / -1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 4px 0 6px;
		background: linear-gradient(90deg, var(--titlebar-a), var(--titlebar-b));
		color: var(--white);
		overflow: hidden;
	}

	.start-avatar {
		width: 16px;
		height: 16px;
		flex: none;
	}

	.start-username {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		font-size: 11px;
		font-weight: 700;
		white-space: nowrap;
	}

	.start-body {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.start-apps {
		display: flex;
		flex-direction: column;
	}

	.start-item {
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		height: 26px;
		padding: 0 4px;
		background: none;
		border: none;
		color: var(--ink);
		cursor: var(--cur-pointer);
		font-family: var(--f-ui);
		font-size: var(--font-size);
		text-align: left;
	}
	.start-item:hover {
		background: var(--titlebar-a);
		color: var(--white);
	}
	.start-item img {
		width: 16px;
		height: 16px;
		flex: none;
	}
	.start-item-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.start-item-label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.start-item-note {
		font-size: 10px;
		opacity: 0.7;
	}
	.hotkey {
		text-decoration: underline;
	}
	.sep {
		height: 1px;
		background: var(--shadow);
		box-shadow: 0 1px 0 var(--white);
		margin: 2px 1px;
	}
</style>
