import { Collections, type WorldsResponse } from '#lib/types.ts';
import { pb } from '#lib/utils.ts';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async () => {
	const records: WorldsResponse[] = await pb
		.collection(Collections.Worlds)
		.getFullList(100 /* batch size */, {
			sort: '-created',
		});
	return {
		worlds: records,
	};
};
