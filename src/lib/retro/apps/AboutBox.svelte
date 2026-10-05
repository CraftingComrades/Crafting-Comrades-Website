<script lang="ts">
	import Win98Window from '../Win98Window.svelte';

	type Props = {
		title: string;
		icon: string;
		heading: string;
		subheading: string;
		lines: string[];
		onclose: () => void;
	};

	let { title, icon, heading, subheading, lines, onclose }: Props = $props();
</script>

<Win98Window {title} {icon} width="20rem" {onclose}>
	<div class="about">
		<img src="/retro/icons/{icon}" alt="" class="about-icon" />
		<div class="about-heading">{heading}</div>
		<div class="about-sub">{subheading}</div>
		<div class="about-rule"></div>
		{#each lines as line (line)}
			<div>{line}</div>
		{/each}
		<div class="about-credit">From <a href="https://windows93.net/">https://windows93.net/</a></div>
		<button class="w98-button about-ok" onclick={onclose}>OK</button>
	</div>
</Win98Window>

<style>
	.about {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		padding: 10px;
		text-align: center;
		background: var(--face);
		color: var(--ink);
	}
	.about-icon {
		width: 32px;
		height: 32px;
	}
	.about-heading {
		font-size: 12px;
		font-weight: 700;
		margin-top: 3px;
	}
	.about-sub {
		font-size: var(--font-size);
		text-shadow: 1px 1px 0 var(--white);
	}
	.about-rule {
		height: 1px;
		width: 100%;
		background: var(--shadow);
		box-shadow: 0 1px 0 var(--white);
		margin: 6px 0;
	}
	.about-credit {
		margin-top: 8px;
		font-size: 10px;
		opacity: 0.8;
	}
	.about-ok {
		width: 75px;
		height: 23px;
		margin-top: 8px;
		justify-content: center;
		box-shadow: var(--bevel-out-bold);
	}
</style>
