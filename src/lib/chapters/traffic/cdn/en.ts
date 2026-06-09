import type { CdnText } from '../types';

export const en: CdnText = {
	title: 'Caching and CDN',
	intro: [
		'Remember latency from the first chapter? The farther the server, the longer data takes to arrive. A visitor in Jakarta fetching from a server in the United States has to wait out a long round trip.',
		'Plenty of things do not actually change between requests, like images and logos that stay the same. Instead of fetching them from far away every time, keep a copy close to the visitor. Keeping a ready copy like this is called <b>caching</b>.',
		'A <b>CDN</b> (Content Delivery Network) places those copies in many cities around the world. Visitors are served from the nearest point, not from the distant origin server.',
		'Try sending a request with the CDN off first, and see how long the far origin takes. Then turn the CDN on and send again, now served from a nearby cache.'
	],
	reactions: {
		origin:
			'The CDN is still off, so the request has to travel all the way to the origin server and back. That is hundreds of milliseconds. Turn the CDN on, then send again.',
		cached:
			'Much faster. The copy is already in a nearby cache, so there is no long trip to the origin. Just a dozen or so milliseconds. That is what a CDN is for.'
	},
	cdnOn: 'Turn on CDN',
	cdnOff: 'Turn off CDN',
	send: 'Send request',
	originLabel: 'Origin server',
	edgeLabel: 'Nearby cache',
	userLabel: 'Visitor',
	ms: 'ms',
	farNote: 'long trip to the origin',
	nearNote: 'answered by the nearby cache',
	off: 'CDN off',
	on: 'CDN on'
};
