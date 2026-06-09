import type { ScalingText } from '../types';

export const en: ScalingText = {
	title: 'Scaling: vertical vs horizontal',
	intro: [
		'Your traffic keeps climbing and a single ordinary server starts to struggle. There are two ways to add power, and they work in very different styles.',
		'First way: <b>vertical scaling</b>. You swap the server for a bigger machine, more CPU and RAM in one box. It is simple and changes nothing else, but it hits a ceiling. Even the biggest machine has a limit, it gets expensive, and it stays a single point that takes everything down if it dies.',
		'Second way: <b>horizontal scaling</b>. Instead of one big box, you run many identical boxes side by side and share the load. It scales much further, and if one dies the rest keep going. The catch is you need a load balancer in front and an app that does not keep its data on one machine.',
		'Try both. Click Vertical until the box cannot grow any bigger, then click Horizontal to add boxes that share the load.'
	],
	reactions: {
		vertical:
			'Vertical scaling: the same single box, just bigger, with more CPU and RAM. Keep clicking until it hits its ceiling.',
		ceiling:
			'There it is, maxed out. The machine is as big as it gets and cannot grow further. That is the ceiling of vertical scaling, and it is still one fragile point. Try Horizontal.',
		horizontal:
			'Horizontal scaling: add an identical box beside it and split the load. You can keep adding more, and if one box dies the others keep serving.'
	},
	verticalBtn: 'Vertical: grow it',
	horizontalBtn: 'Horizontal: add a box',
	reset: 'Reset',
	verticalLabel: 'Vertical: one bigger machine',
	horizontalLabel: 'Horizontal: more machines',
	cpuLabel: 'CPU + RAM',
	maxedOut: 'Maxed out',
	addNote: 'add machines',
	workloadLabel: 'Workload rising',
	tradeoffVertical: 'Simple, but it hits a ceiling, gets costly, and stays one fragile point.',
	tradeoffHorizontal: 'Far more flexible and survives a box dying, but it needs a load balancer.'
};
