import { json } from '@sveltejs/kit';
import { spaceImages } from '$lib/server/space-images';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = async () => {
	const image = await spaceImages.getRandom(globalThis.fetch);
	return json({ image }, { headers: { 'Cache-Control': 'no-store' } });
};
