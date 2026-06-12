import type { MonitoringText } from '../types';

export const en: MonitoringText = {
	title: 'Watching the system',
	intro: [
		'Picture a car dashboard. You get a speedometer, an engine temperature, a fuel gauge. Without them you drive blind and only notice the engine is overheating once smoke pours out.',
		'A server is the same. <b>Metrics</b> are its health numbers, like CPU usage, how much traffic is coming in, and how many errors are happening. A <b>dashboard</b> puts all those numbers on one screen so you can read the system at a glance.',
		'But you cannot stare at a dashboard all day. That is where <b>alarms</b> come in. You set a limit, say CPU above 80 percent, and the moment a metric crosses it the alarm fires and warns you, well before visitors ever feel the site slow down.',
		'Give it a try. These gauges move with the real state of the server. Drag the CPU alarm limit, then wait a moment for CPU to spike and the alarm to fire.'
	],
	reactions: {
		'alarm-set': 'Nice, the alarm is armed. Now the system watches CPU for you. Hang on a moment, traffic usually climbs and CPU spikes with it.',
		'alarm-fired':
			'There it is. CPU crossed your limit and the alarm fired at once. You found out first and had time to act, before a single visitor felt anything wrong. That is the whole point of watching.'
	},
	cpuLabel: 'CPU',
	trafficLabel: 'Traffic',
	errorsLabel: 'Errors',
	thresholdLabel: 'CPU alarm limit: {n} percent',
	setAlarm: 'Set alarm',
	alarmArmed: 'Alarm armed at {n} percent',
	alarmFiring: 'Alarm firing',
	allCalm: 'All calm',
	siteUp: 'Healthy',
	siteWarn: 'Needs attention',
	hint: 'Drag the limit, then set the alarm'
};
