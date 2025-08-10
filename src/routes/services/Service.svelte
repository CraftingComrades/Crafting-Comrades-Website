<script lang="ts">
	import FileDownload from '$lib/FileDownload.svelte';
	import PreviewImage from '$lib/PreviewImage.svelte';
	import type { ServicesRecord, ServicesResponse } from '$lib/types';
	import { pb } from '$lib/utils';

	interface Props {
		service: ServicesRecord;
	}

	let { service }: Props = $props();

	let hidden = $state(true);
	let toggleHidden = () => {
		hidden = !hidden;
	};
</script>

<div class="listitem" id={service.slug}>
	<button class="header" onclick={toggleHidden}>
		<img
			src={pb.files.getURL(service, service.thumbnail, { thumb: '128x128' })}
			class="thumbnail"
			alt={`${service.title} Icon`}
		/>
		<div class="information">
			<div>
				<div class="title">{service.title}</div>
			</div>
			<div class="tags">
				{#if service.tags?.length}
					{#each (service.tags ?? '').split(',') as tag}
						<div class="tag">{tag}</div>
					{/each}
				{/if}
			</div>
		</div>
	</button>
	{#if !hidden}
		<div class="hidden">
			{#if service.longDescription}
				<div class="section">
					<div class="section-title">Long Description</div>
					<div class="long-description">{service.longDescription}</div>
				</div>
			{/if}
			{#if service.images?.length}
				<div class="section">
					<div class="section-title">Images</div>
					<div class="images">
						{#each service.images ?? [] as image}
							<PreviewImage imageRef={{ record: service, file: image }} />
						{/each}
					</div>
				</div>
			{/if}
			{#if service.link}
				<div class="link">
					<a
						target={service.newTab ? '_blank' : '_self'}
						class="linkButton"
						style=""
						href={service.link}
					>
						{#if service.linkButton}
							{service.linkButton}
						{:else}
							Go!
						{/if}
					</a>
				</div>
			{/if}
			{#if service.otherDownloads?.length}
				<div class="section">
					<div class="section-title">Other Downloads</div>
					<div class="other-downloads">
						{#each service.otherDownloads ?? [] as download}
							<FileDownload file={pb.files.getURL(service, download)} />
						{/each}
					</div>
				</div>
			{/if}
			{#if service.downloads?.length}
				<div class="section">
					<div class="section-title">Downloads</div>
					<div class="downloadslink">
						{#each service.downloads ?? [] as download}
							<FileDownload file={pb.files.getURL(service, download)} />
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
