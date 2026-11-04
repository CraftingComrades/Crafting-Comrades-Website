const allEvents = {
	space: {
		key: 'space',
		dateStart: { month: 9, day: 4 },
		dateEnd: { month: 9, day: 10 },
		tabs: {
			modpacks: 'Launch Packs',
			worlds: 'Planets',
			map: 'Star Map',
			about: 'Mission Control',
			services: 'Space Station',
			tmpFiles: 'Cargo Bay',
		},
		copyright: '© copyright lololol',
	},
	retro: {
		key: 'retro',
		dateStart: { month: 6, day: 27 },
		dateEnd: { month: 7, day: 6 },
		tabs: {
			modpacks: 'Downloads',
			worlds: 'My Worlds',
			map: 'Home Page',
			about: 'Read Me',
			services: 'Favourites',
			tmpFiles: 'Temp Files',
		},
		copyright: '(c) 1998 Crafting Comrades. Best viewed in Netscape Navigator 4.0.',
		fileIconExt: 'png',
	},
	pirate: {
		key: 'pirate',
		dateStart: { day: 14, month: 9 },
		dateEnd: { day: 24, month: 9 },
		tabs: {
			modpacks: 'Booty',
			worlds: 'Seven Seas',
			map: 'Treasure Map',
			about: 'Crew',
			services: 'Bounty',
			tmpFiles: "Ship's Log",
		},
		copyright: '© Arr! All rights reserved, ye scurvy dogs!',
	},
	summer: {
		key: 'summer',
		dateStart: { month: 5, day: 21 }, // June is month 5 (0-indexed)
		dateEnd: { month: 7, day: 23 }, // August is month 7
		tabs: {
			modpacks: 'Hot Mods',
			worlds: 'Sunny Islands',
			map: 'Beach Map',
			about: 'Lifeguards',
			services: 'Surf Shop',
			tmpFiles: 'Holiday Snaps',
		},
		copyright: '© Sizzling Summer! All rights reserved under the sun!',
	},
	fool: {
		key: 'fool',
		dateStart: { month: 3, day: 1 },
		dateEnd: { month: 3, day: 2 },
		tabs: {
			modpacks: 'Mawdpwacksh',
			worlds: 'Wawwwdsh',
			map: 'Mapw',
			about: 'Abawut',
			services: 'Shewvicesh',
			tmpFiles: 'TMPW Fiwesh',
		},
		copyright: '© OwO Aww wiwhtsh weshewved undew UwU!',
	},
} as const;

const defaultEvent = {
	key: 'default',
	dateStart: null,
	dateEnd: null,
	tabs: {
		modpacks: 'Modpacks',
		worlds: 'Worlds',
		map: 'Map',
		about: 'About',
		services: 'Services',
		tmpFiles: 'TMP Files',
	},
	copyright: '© copyright lololol',
} as const;

export type SiteEvent = (typeof allEvents)[keyof typeof allEvents] | typeof defaultEvent;

export function getCurrentEvent(now = new Date(), override: string | null = null) {
	if (override) {
		const forced = Object.values(allEvents).find((event) => event.key === override);
		if (forced) return forced;
	}

	const currentMonth = now.getMonth();
	const currentDay = now.getDate();

	for (const event of Object.values(allEvents)) {
		if (event.dateStart && event.dateEnd) {
			const isAfterStart =
				currentMonth > event.dateStart.month ||
				(currentMonth === event.dateStart.month && currentDay >= event.dateStart.day);

			const isBeforeEnd =
				currentMonth < event.dateEnd.month ||
				(currentMonth === event.dateEnd.month && currentDay <= event.dateEnd.day);

			if (isAfterStart && isBeforeEnd) {
				return event;
			}
		}
	}

	return defaultEvent;
}
