import type { CostText } from '../types';

export const en: CostText = {
	title: 'Keeping cost in check',
	intro: [
		'The cloud is like a utility bill. You <b>pay as you go</b>. Use more, pay more. Turn it off, stop paying. There is no flat fee for a machine sitting idle in a warehouse.',
		'That makes one habit quietly expensive: leaving resources running when nothing uses them, or renting a machine far bigger than the job needs. The meter keeps ticking and the bill keeps climbing, even with no one on it.',
		'The fix is called <b>right sizing</b>: matching resources to real need. Turn off what is idle, shrink what is oversized. But be careful, too small is bad too: if a machine is overwhelmed, your users pay for it. The goal is the right size, not the smallest.',
		'Look at your monthly bill on the side. One box sits idle and one is oversized. Tidy up both and watch the bill drop.'
	],
	reactions: {
		wasteful:
			'Look at the number. That idle box serves no one at all, yet its bill is full. The oversized one too, its capacity dwarfs what it actually uses. That is money burned every month.',
		rightsized:
			'There, much leaner. You switched off the idle box and shrank the oversized one to a fitting size, so it still serves users well but the bill drops a lot. That is right sizing.'
	},
	billLabel: 'Monthly bill',
	perMonth: 'per month',
	idleLabel: 'Test server',
	idleSub: 'Idle, no traffic',
	bigLabel: 'Web server',
	bigSub: 'Oversized for its load',
	rightLabel: 'Database',
	rightSub: 'Already right sized',
	turnOff: 'Turn off',
	downsize: 'Downsize',
	usageLabel: '{n} percent used',
	tooSmall: 'Too small, users overwhelmed',
	hint: 'Turn off the idle one, shrink the oversized one'
};
