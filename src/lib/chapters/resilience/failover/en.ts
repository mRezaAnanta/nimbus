import type { FailoverText } from '../../types';

export const en: FailoverText = {
	title: 'What is failover?',
	intro: [
		'Spreading across AZs is fine when one building falls. But if a whole region is hit, like when the data centers in the Middle East were struck, you need a bigger plan.',
		'The way to do it is to keep a <b>standby region</b> elsewhere. The primary region serves while the standby waits on standby. The moment the primary falls, traffic switches to the standby automatically. That automatic switch is called <b>failover</b>.',
		'Think of a branch office that takes over the instant the head office closes. There is always a ready replacement.',
		'Try it. Right now there is only the primary region. Kill it and watch what happens.'
	],
	reactions: {
		spof: 'Right, with no standby region your site goes down the moment the primary region falls. Click another region to make it a standby, then kill the primary again.',
		failover: 'See, the moment the primary region dies traffic moves to the standby region and your site keeps running. That is failover.'
	},
	primaryLabel: 'Primary',
	standbyLabel: 'Standby',
	serving: 'Serving',
	standbyState: 'Ready',
	failingOver: 'Failing over',
	kill: 'Kill the primary',
	addHint: 'Click another region to set up a standby',
	statusUp: 'Online',
	statusDown: 'Down',
	regions: { virginia: 'Virginia', singapore: 'Singapore' }
};
