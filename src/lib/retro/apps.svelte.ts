import type { RouteId } from '$app/types';
import type { Component } from 'svelte';
import BubbleWrap from './apps/BubbleWrap.svelte';
import HampsterDance from './apps/HampsterDance.svelte';
import Minesweeper from './apps/Minesweeper.svelte';
import Pinball from './apps/Pinball.svelte';

export interface RetroApp {
	id: string;
	label: string;
	icon: string;
	description: string;
	component: Component<{ onclose: () => void }>;
}

export const RETRO_APPS: RetroApp[] = [
	{
		id: 'bubblewrap',
		label: 'Bubble Wrap',
		icon: 'bubbles-icon-32.png',
		description: 'Click and drag to pop bubbles.',
		component: BubbleWrap,
	},
	{
		id: 'minesweeper',
		label: 'Minesweeper',
		icon: 'executable-0.png',
		description: 'Your first click is always a bomb.',
		component: Minesweeper,
	},
	{
		id: 'hampsterdance',
		label: 'HampsterDance',
		icon: 'hampster-icon-32.gif',
		description: 'Scroll down for more hamsters.',
		component: HampsterDance,
	},
	{
		id: 'pinball',
		label: '3D Pinball for Windows',
		icon: 'pinball-32.png',
		description: 'Space Cadet. Z and / are the flippers.',
		component: Pinball,
	},
];

export const RETRO_LINKS: { label: string; href: RouteId; icon: string }[] = [
	{ label: 'Modpacks', href: '/modpacks', icon: 'directory_business_calendar-0.png' },
	{ label: 'Worlds', href: '/worlds', icon: 'directory_open_file_mydocs-0.png' },
	{ label: 'Map', href: '/map', icon: 'directory_explorer-0.png' },
	{ label: 'About', href: '/about', icon: 'notepad-0.png' },
	{ label: 'Services', href: '/services', icon: 'computer_explorer-2.png' },
	{ label: 'TMP Files', href: '/tmp-files', icon: 'document-0.png' },
];

const open = $state<{ id: string }[]>([]);

export function isOpen(id: string): boolean {
	return open.some((a) => a.id === id);
}

export function launch(id: string) {
	if (!open.some((a) => a.id === id)) open.push({ id });
}

export function shutdown(id: string) {
	const i = open.findIndex((a) => a.id === id);
	if (i >= 0) open.splice(i, 1);
}
