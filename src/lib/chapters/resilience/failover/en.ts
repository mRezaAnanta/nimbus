import type { FailoverText } from '../../types';

export const en: FailoverText = {
	title: 'What is failover?',
	intro: [
		'Imagine your whole site rests on one primary server. If it dies, everything dies with it. A single thing that can take it all down is called a <b>single point of failure</b>.',
		'The fix is to keep a <b>standby server</b> ready. The moment the primary falls, traffic switches to the standby automatically. That automatic switch is called <b>failover</b>.',
		'Think of a spare tire, or a generator that kicks in the moment the power cuts. There is always a ready replacement.',
		'Try it. Right now there is only the primary server. Kill it and watch what happens.'
	],
	reactions: {
		spof: 'Right, with no standby your site goes down the instant the primary falls. Add a standby server first, then kill the primary again.',
		failover: 'See, the moment the primary dies traffic moves to the standby and your site keeps running. That is failover.'
	},
	primaryLabel: 'Primary server',
	standbyLabel: 'Standby server',
	serving: 'Serving',
	standbyState: 'Standby',
	failingOver: 'Failing over',
	kill: 'Kill the primary',
	addHint: 'Click the standby box to set it up',
	statusUp: 'Online',
	statusDown: 'Down'
};
