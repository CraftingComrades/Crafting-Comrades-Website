import type { SpaceImage } from '../space-image';

const WEEK = 7 * 24 * 60 * 60 * 1000;
const RETRY_DELAY = 5 * 60 * 1000;

function plainText(value: string): string {
	const entities: Record<string, string> = {
		amp: '&',
		quot: '"',
		apos: "'",
		lt: '<',
		gt: '>',
		nbsp: ' ',
	};
	return value
		.replace(/<[^>]*>/g, '')
		.replace(/&(amp|quot|apos|lt|gt|nbsp);/g, (_, name: string) => entities[name])
		.trim();
}

function httpsUrl(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	try {
		const url = new URL(value);
		return url.protocol === 'https:' ? url.href : null;
	} catch {
		return null;
	}
}

export class SpaceImageCache {
	private images: SpaceImage[] = [];
	private expiresAt = 0;
	private retryAt = 0;
	private pending: Promise<void> | null = null;

	private now: () => number;
	private random: () => number;

	constructor(now = () => Date.now(), random = () => Math.random()) {
		this.now = now;
		this.random = random;
	}

	async getRandom(fetcher: typeof fetch): Promise<SpaceImage | null> {
		if (this.now() >= this.expiresAt && this.now() >= this.retryAt) {
			if (!this.pending) {
				this.pending = this.refresh(fetcher).finally(() => {
					this.pending = null;
				});
			}
			await this.pending;
		}
		return this.images.length ? this.images[Math.floor(this.random() * this.images.length)] : null;
	}

	private async refresh(fetcher: typeof fetch) {
		const end = new Date(this.now());
		end.setUTCDate(end.getUTCDate() - 1);

		const start = new Date(end);
		start.setUTCDate(start.getUTCDate() - 59);

		const startDate = start.toISOString().slice(0, 10);
		const endDate = end.toISOString().slice(0, 10);
		const url = new URL('https://science.nasa.gov/wp-json/wp/v2/apod-basic');

		url.search = new URLSearchParams({
			date_from: startDate.slice(2).replaceAll('-', ''),
			date_to: endDate.slice(2).replaceAll('-', ''),
			per_page: '25',
		}).toString();

		try {
			const pages = await Promise.all(
				[1, 2, 3].map(async (page) => {
					const pageUrl = new URL(url);
					pageUrl.searchParams.set('page', String(page));

					const response = await fetcher(pageUrl, { signal: AbortSignal.timeout(8000) });
					if (!response.ok) throw new Error('NASA request failed');

					const entries: unknown = await response.json();
					if (!Array.isArray(entries)) throw new Error('Invalid NASA response');

					return entries;
				}),
			);

			const entries = pages.flat();
			const images: SpaceImage[] = [];

			for (const entry of entries) {
				if (!entry || entry.media_type !== 'image') continue;

				// APOD hdurl for the image.
				const imageUrl = httpsUrl(entry.hdurl) ?? httpsUrl(entry.url);

				if (
					!imageUrl ||
					imageUrl.includes('/wp-content/themes/') ||
					!/\.(?:jpe?g|png|webp|gif|avif)(?:\?|$)/i.test(imageUrl) ||
					typeof entry.date !== 'string' ||
					!/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
					entry.date < startDate ||
					entry.date > endDate ||
					typeof entry.title !== 'string'
				)
					continue;

				images.push({
					url: imageUrl,
					title: plainText(entry.title),
					date: entry.date,
					credit:
						typeof entry.copyright === 'string'
							? plainText(entry.copyright)
							: typeof entry.credit === 'string'
								? plainText(entry.credit)
								: 'NASA / APOD',
					sourceUrl:
						httpsUrl(entry.permalink) ??
						`https://apod.nasa.gov/apod/ap${entry.date.slice(2).replaceAll('-', '')}.html`,
				});
			}

			if (!images.length) throw new Error('No usable NASA images');

			this.images = images;
			this.expiresAt = this.now() + WEEK;
			this.retryAt = 0;
		} catch {
			this.retryAt = this.now() + RETRY_DELAY;
			console.warn('NASA backgrounds unavailable; using cached images or the starfield fallback.');
		}
	}
}

export const spaceImages = new SpaceImageCache();
