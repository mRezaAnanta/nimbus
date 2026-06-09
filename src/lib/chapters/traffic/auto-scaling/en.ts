import type { AutoScalingText } from '../types';

export const en: AutoScalingText = {
	title: 'Auto scaling',
	intro: [
		'Horizontal scaling is great, but how many servers should you keep? Too few and you choke when it gets busy. Too many all the time and you pay a lot while nights sit quiet.',
		'Traffic rises and falls through the day. Quiet at midnight, busy at midday. It is wasteful to keep the same server count no matter what.',
		'<b>Auto scaling</b> adds and removes servers automatically as demand changes. Busy, it adds servers on its own. Quiet, it removes them on its own. You only pay for what actually runs.',
		'Press play and watch a full day spin by. See the server count follow the traffic curve up and down, with the cost meter moving right alongside it.'
	],
	reactions: {
		'scaled-up':
			'See, traffic peaks around midday and servers add themselves until they are full. Nothing gets overwhelmed, and cost only rises when it is needed.',
		'scaled-down':
			'Night falls, traffic drops, and servers are removed automatically again. Cost falls with it. You only pay for what is running.'
	},
	play: 'Play one day',
	running: 'Running...',
	again: 'Play again',
	serversLabel: 'Servers: {n}',
	costLabel: 'Cost',
	trafficLabel: '24 hour traffic',
	night: 'night, quiet',
	midday: 'midday, busy',
	payNote: 'Servers follow traffic automatically, so you pay only for what you use.'
};
