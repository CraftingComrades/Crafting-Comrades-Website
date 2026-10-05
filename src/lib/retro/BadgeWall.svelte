<script lang="ts">
	const badges = [
		'dabamos-03.gif',
		'yesterweb-14.png',
		'yesterweb-17.gif',
		'dabamos-18.gif',
		'capstasher-19.png',
		'dabamos-21.gif',
		'dabamos-27.gif',
		'dabamos-39.gif',
		'yesterweb-41.gif',
		'dabamos-51.gif',
		'dabamos-54.gif',
	];
</script>

<div class="badge-wall">
	{#each badges as badge (badge)}
		<img src="/retro/badges/{badge}" alt={'Web badge'} />
	{/each}
</div>
