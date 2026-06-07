import type { AZText } from '../../types';

export const en: AZText = {
	title: 'What is an Availability Zone?',
	intro: [
		'You already picked the nearest region. But a region is not actually a single building.',
		'Inside one region there are several separate data centers called <b>Availability Zones</b> (AZ for short), set far apart with their own power and network.',
		'Why separate them? Because one building can hit trouble, a power cut, a fire, or a flood. If all your servers sit in one AZ, a single mishap takes your whole site down.',
		'See for yourself. Right now your server is in just one AZ. Trigger an outage and watch what happens.'
	],
	reactions: {
		down: 'There it is. With everything in one AZ, the moment that AZ fails your site goes down with it. Now spread your servers to other AZs and trigger it again.',
		survived: 'Feel the difference. One AZ falls, but the others keep serving, so your site survives. That is what spreading across AZs is for.'
	},
	regionLabel: 'Your region',
	zonePrefix: 'Zone',
	serverLabel: 'Server',
	place: 'Click a zone to add or remove a server',
	trigger: 'Trigger an outage',
	outage: 'Outage',
	statusUp: 'Online',
	statusDown: 'Down',
	activeZones: 'Active zones'
};
