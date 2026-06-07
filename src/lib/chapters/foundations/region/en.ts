import type { RegionText } from '../../types';

export const en: RegionText = {
	title: 'What is a Region?',
	intro: [
		"Let's say you have lots of users in <b>Argentina</b>. Your server has to sit in one of the cloud provider's data center locations.",
		'The catch: Argentina has no data center of its own yet. But there is one on the same continent, and that choice of location decides how fast the site feels for your users.',
		'Place your server in a few cities, then watch the <b>latency</b> (the round-trip time of the data).'
	],
	reactions: {
		near: 'See, <b>São Paulo</b> is not in Argentina, but it is on the same continent, so it has the lowest latency of the options.',
		mid: 'Fairly far, the latency climbs. There is still a region closer to your users.',
		far: 'Way too far. The data has to cross <b>half the world</b>, so it lags. That is exactly why picking the nearest region matters.'
	},
	users: 'Your users',
	readoutPrompt: 'Pick a city to measure its speed',
	drag: 'Drag to spin the globe',
	flatLabel: 'Map',
	globeLabel: 'Globe',
	ms: 'ms',
	verdicts: { instant: 'Instant', fast: 'Fast', ok: 'Okay', slow: 'A bit slow', laggy: 'Laggy' },
	cities: { jkt: 'Jakarta', sg: 'Singapore', tyo: 'Tokyo', fra: 'Frankfurt', iad: 'Virginia, US', sao: 'São Paulo' }
};
