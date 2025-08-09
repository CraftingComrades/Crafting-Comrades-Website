<script lang="ts">
	import { onMount } from 'svelte';
	import type { ServerPingResponse } from './ServerPingResponse';

	let serverData: Promise<ServerPingResponse> = $state(new Promise(() => {}));

	async function fetchServerData() {
		serverData = fetch('https://api.mcsrvstat.us/2/craftingcomrades.net').then(
			(res) => res.json() as Promise<ServerPingResponse>,
		);
	}

	onMount(fetchServerData);
</script>

{#await serverData then serverData}
	{#if serverData && serverData.online}
		<div class="listitem">
			<div class="header" style="cursor: default; background-color: #222222">
				<img
					src={serverData.icon || 'https://via.placeholder.com/150'}
					class="thumbnail"
					alt="server icon"
					style="image-rendering:pixelated;"
				/>
				<div class="information">
					<div>
						<div class="online-server-description">
							Current Online Server:
							<span style="float:right">
								{serverData.players?.online} / {serverData.players?.max}
							</span><br />
							{@html serverData.motd?.html[0]}<br />{@html serverData.motd?.html[1]}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/await}
