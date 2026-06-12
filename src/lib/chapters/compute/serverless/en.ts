import type { ServerlessText } from '../types';

export const en: ServerlessText = {
	title: 'Serverless',
	intro: [
		'Sometimes you only need a snippet of code that runs occasionally, sending OTP emails, resizing photos, receiving payment webhooks. On a normal server it stays on 24 hours with the meter always running, while the actual work is occasional.',
		'The <b>serverless</b> architecture fixes that. Follow the flow. A request reaches the provider’s gate, the provider lights up a tiny sandbox in a blink, your function runs inside it, done, the box is shut down immediately. Quiet means truly zero.',
		'That sandbox is not magic. AWS Lambda boots a micro VM called <b>Firecracker</b>, Google Cloud uses <b>gVisor</b>. Both start in a fraction of a second, which is why providers dare to start from zero.',
		'Send a request from the phone and watch the function wake, work, then sleep again. This is only the surface, a later chapter dives much deeper into the serverless world.'
	],
	reactions: {
		invoked:
			'See, the function woke up only because it was called, worked briefly, done. No server for you to babysit, and the meter only counts calls.',
		zero: 'And the moment it goes quiet, it sleeps back to zero. No silent bill running overnight. That is the charm of serverless.'
	},
	fnLabel: 'sendOTP function',
	sleepTag: 'asleep, zero cost',
	wakeTag: 'awake',
	runTag: 'working',
	send: 'Call the function',
	callsLabel: 'Called {n}×, paying per call',
	userLabel: 'A user’s phone',
	reqTag: 'request',
	resTag: 'OTP sent',
	alwaysName: 'A normal server',
	alwaysTag: 'charging 24 hours, working occasionally',
	archSteps: ['A request arrives', 'Provider gate', 'Sandbox lights up', 'Your function runs', 'Shut down at once'],
	behindItems: ['Firecracker, AWS’s micro VM', 'gVisor, Google’s sandbox'],
	noteIdle: 'The function sleeps, charging nothing at all',
	noteRun: 'Awake in a blink, works, then bows out',
	noteZero: 'Back to sleep at zero'
};
