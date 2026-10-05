const cache = new Map<string, HTMLAudioElement>();

const FILES = {
	clickDown: 'click-down',
	clickUp: 'click-up',
	warning: 'ding',
	startup: 'startup',
} as const;

export type SoundName = keyof typeof FILES;

export function playSound(name: SoundName | string, volumeOverride?: number) {
	if (typeof window === 'undefined') return;
	if (!navigator.userActivation?.hasBeenActive) return;

	const effectiveVolume = volumeOverride ?? 0.5;
	if (effectiveVolume <= 0) return;

	const file = FILES[name as SoundName] ?? name;
	let audio = cache.get(file);
	if (!audio) {
		audio = new Audio(`/retro/sounds/${file}.mp3`);
		cache.set(file, audio);
	}
	try {
		audio.volume = effectiveVolume;
		audio.currentTime = 0;
		void audio.play();
	} catch {
		// autoplay blocked
	}
}

export function click98(node: HTMLElement) {
	const down = () => playSound('clickDown');
	const up = () => playSound('clickUp');
	node.addEventListener('mousedown', down);
	node.addEventListener('mouseup', up);
	return {
		destroy() {
			node.removeEventListener('mousedown', down);
			node.removeEventListener('mouseup', up);
		},
	};
}
