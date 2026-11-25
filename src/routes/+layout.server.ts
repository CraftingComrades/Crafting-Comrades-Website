import { dev } from '$app/env';
import { getCurrentEvent } from '#lib/events.ts';
import type { SpaceImage } from '#lib/space-image.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, url, setHeaders }) => {
	const event = getCurrentEvent(new Date(), dev ? url.searchParams.get('theme') : null);
	let spaceImage: SpaceImage | null = null;

	if (event.key === 'space') {
		const response = await fetch('/api/space-image');
		({ image: spaceImage } = await response.json());
		setHeaders({ 'cache-control': 'private, no-store' });
	}

	return { event, spaceImage };
};
