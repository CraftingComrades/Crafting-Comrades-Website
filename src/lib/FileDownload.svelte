<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		file: string; // url to the file
		name?: string;
	}

	let { file, name = '' }: Props = $props();
	let fileName: string = $derived(
		name || file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.') - 11),
	);
	let extension: string = $derived(file.substring(file.lastIndexOf('.') + 1));

	function capitalCase(str: string) {
		let words = str.split('_');
		let capitalizedWords = words.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		});
		return capitalizedWords.join(' ');
	}

	const currentEvent = $derived(page.data.event);

	const ICONS: Record<string, string> = {
		// pictures
		png: 'Image',
		jpg: 'Image',
		jpeg: 'Image',
		gif: 'Image',
		webp: 'Image',
		svg: 'Image',
		bmp: 'Image',
		tiff: 'Image',
		ico: 'Image',
		// motion
		mp4: 'Video',
		webm: 'Video',
		mov: 'Video',
		avi: 'Video',
		mkv: 'Video',
		m4v: 'Video',
		// sound
		mp3: 'Audio',
		wav: 'Audio',
		ogg: 'Audio',
		flac: 'Audio',
		m4a: 'Audio',
		opus: 'Audio',
		// archives & packages
		zip: 'Compressed',
		rar: 'Compressed',
		'7z': 'Compressed',
		tar: 'Compressed',
		gz: 'Compressed',
		bz2: 'Compressed',
		xz: 'Compressed',
	};

	const iconExt = $derived('fileIconExt' in currentEvent ? currentEvent.fileIconExt : 'svg');
	const iconName = $derived(ICONS[extension.toLowerCase()] ?? 'File');
	const iconSrc = $derived(
		`/${currentEvent.key === 'space' ? 'default' : currentEvent.key}/FileIcons/${iconName}.${iconExt}`,
	);
</script>

<a href={file} download="name.zip" class="file">
	<img src={iconSrc} class="file-icon" alt="File Download" />
	<div class="file-extenstion">{extension}</div>
	<div class="file-name">{capitalCase(fileName)}</div>
</a>

<style>
	.file {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: column;
		min-width: 0;
		gap: 0.25rem;
		width: 100%;
		height: 100%;
		padding: 0.75rem 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background-color: var(--background-color);
		color: var(--text-color);
		position: relative;
	}
	.file-icon {
		width: 100%;
		max-width: 4rem;
		height: auto;
		filter: drop-shadow(-0.25rem 0.25rem 0.25rem rgba(0, 0, 0, 0.075));
	}
	.file-extenstion {
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		opacity: 0.7;
	}
	.file-name {
		font-size: 0.8125rem;
		text-align: center;
		max-width: 100%;
		margin-top: auto;
		padding: 0 2px;
	}
</style>
