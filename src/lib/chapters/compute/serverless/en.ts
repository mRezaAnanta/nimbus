import type { ServerlessText } from '../types';

export const en: ServerlessText = {
	title: 'What is serverless?',
	intro: [
		'A normal server runs all the time, 24 hours a day. The catch is that it keeps costing money even when it is quiet, without a single visitor. You pay for its idle time.',
		'There is another way. You just write a <b>function</b>, and the platform runs it whenever a request comes in. No traffic, nothing running, and the cost is zero. This is called <b>serverless</b>, and you pay per call.',
		'Picture a light with a motion sensor. It stays off while no one is around. The moment someone walks in it switches on, does its job, then goes dark again on its own. No power wasted on an empty room.',
		'Try it. On the left is an always on server whose cost keeps ticking. On the right is serverless. Send a few requests and watch when the cost actually moves.'
	],
	reactions: {
		idle: 'Watch that always on server. With zero visitors its cost still climbs. Now try sending a request to the serverless side.',
		invoke: 'There it is, a request arrives, the function spins up instantly, does its work, then drops back to zero. Cost only moves on a real call. Quiet means free.'
	},
	alwaysOnTitle: 'Always on server',
	alwaysOnSub: 'runs 24 hours, even when idle',
	serverlessTitle: 'Serverless',
	serverlessSub: 'runs on a call, then drops to zero',
	sendRequest: 'Send a request',
	idleLabel: 'Idle',
	runningLabel: 'Running',
	zeroLabel: 'Zero, asleep',
	costLabel: 'Cost',
	tickHint: 'Idle cost keeps running',
	invokeHint: 'Cost only on a call',
	functionLabel: 'Your function',
	requestLabel: 'request'
};
