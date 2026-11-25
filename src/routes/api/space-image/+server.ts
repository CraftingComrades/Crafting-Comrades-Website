import { spaceImages } from '#lib/server/space-images.ts';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = async () => {
	const image = await spaceImages.getRandom(globalThis.fetch);
	return Response.json({ image }, { headers: { 'Cache-Control': 'no-store' } });
};
