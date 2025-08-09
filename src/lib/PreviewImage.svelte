<script lang="ts">
	import { pb } from './utils';

	interface Props {
		imageUrl?: string;
		imageRef?: {
			record: any;
			file: string;
		};
	}

	let { imageUrl, imageRef }: Props = $props();
	const smallImageUrl = imageRef
		? pb.files.getURL(imageRef.record, imageRef.file, { thumb: '180x180' })
		: imageUrl;
	if (imageRef) {
		imageUrl = pb.files.getURL(imageRef.record, imageRef.file);
	}

	let overlayHidden = $state(true);
</script>

<div class="image-container">
	<!-- Image thumbnail -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
	<img
		class="image"
		alt={`${imageUrl} Image`}
		src={smallImageUrl}
		onclick={() => (overlayHidden = false)}
	/>

	<!-- Clickable popup that shows larger image -->
	{#if !overlayHidden}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
		<img
			class="image-overlay"
			alt={`${imageUrl} Image`}
			src={imageUrl}
			onclick={() => (overlayHidden = true)}
		/>
	{/if}
</div>

<style>
	.image-container {
		overflow: hidden;
	}
	.image {
		border-radius: 0.5rem;
		object-fit: cover;
		object-position: center;
		aspect-ratio: 1/1;
		height: 100%;
		width: 100%;
		cursor: pointer;
	}
	.image-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 1;
		object-fit: contain;
	}
</style>
