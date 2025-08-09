<script lang="ts">
	import FileDownload from '$lib/FileDownload.svelte';
	import PreviewImage from '$lib/PreviewImage.svelte';
	import type { WorldsResponse } from '$lib/types';
	import { pb } from '$lib/utils';

	interface Props {
		world: WorldsResponse;
	}

	let { world }: Props = $props();

	let hidden = $state(true);
	let toggleHidden = () => {
		hidden = !hidden;
	};
</script>

<div class="listitem" id={world.slug}>
	<button class="header" onclick={toggleHidden}>
		<img
			src={pb.files.getURL(world, world.thumbnail, { thumb: '128x128' })}
			class="thumbnail"
			alt={`${world.title} Icon`}
		/>
		<div class="information">
			<div>
				<div class="title">{world.title}</div>
			</div>
			<div class="tags">
				{#if world.minecraftVersion}
					<div class="tag">{world.minecraftVersion}</div>
				{/if}
				{#if world.modLoader}
					<div class="tag">{world.modLoader}</div>
				{/if}

				{#if world.tags?.length}
					{#each (world.tags ?? '').split(',') as tag}
						<div class="tag">{tag}</div>
					{/each}
				{/if}
			</div>
		</div>
	</button>
	{#if !hidden}
		<div class="hidden">
			{#if world.description}
				<div class="section">
					<div class="section-title">Description</div>
					<div class="long-description">{world.description}</div>
				</div>
			{/if}
			{#if world.images?.length}
				<div class="section">
					<div class="section-title">Images</div>
					<div class="images">
						{#each world.images ?? [] as image}
							<PreviewImage imageRef={{ record: world, file: image }} />
						{/each}
					</div>
				</div>
			{/if}
			{#if world.otherDownloads?.length}
				<div class="section">
					<div class="section-title">Other Downloads</div>
					<div class="other-downloads">
						{#each world.otherDownloads ?? [] as download}
							<FileDownload file={pb.files.getURL(world, download)} />
						{/each}
					</div>
				</div>
			{/if}
			{#if world.downloads?.length}
				<div class="section">
					<div class="section-title">Downloads</div>
					<div class="downloads">
						{#each world.downloads ?? [] as download}
							<FileDownload file={pb.files.getURL(world, download)} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
