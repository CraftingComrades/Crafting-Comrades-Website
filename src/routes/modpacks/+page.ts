import { Collections, type ModpacksResponse } from '#lib/types.ts';
import { pb } from '#lib/utils.ts';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({}) => {
	const records: ModpacksResponse[] = await pb
		.collection(Collections.Modpacks)
		.getFullList(100 /* batch size */, {
			sort: '-created',
		});
	return {
		modpacks: records,
	};
};
