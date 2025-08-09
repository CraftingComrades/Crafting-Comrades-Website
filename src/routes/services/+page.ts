import { Collections, type ServicesResponse } from '$lib/types';
import { pb } from '$lib/utils';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({}) => {
	const records: ServicesResponse[] = await pb
		.collection(Collections.Services)
		.getFullList(100 /* batch size */, {
			sort: '-created',
		});
	return {
		services: records,
	};
};
