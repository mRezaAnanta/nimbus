import type { AZText } from '../../types';

export const en: AZText = {
	title: 'What is an Availability Zone?',
	intro: [
		'This is not just theory. In 2026 drones actually struck AWS data centers in the United Arab Emirates and Bahrain, and many services there went down.',
		'So a data center can hit real trouble, not only a power cut but a disaster or even an attack. The question is, how does your site stay up when a whole building falls?',
		'The answer is, a <b>region</b> is not a single building. Inside it are several separate data centers called <b>Availability Zones</b> (AZ), set far apart with their own power and network.',
		'Try it. Click a region to go inside, spread your servers across several AZs, then trigger an outage.'
	],
	reactions: {
		virginia:
			'Notice the AZ names, <b>us-east-1a</b>, <b>us-east-1b</b>, and so on, always ending in a letter. The twist is that the letter is shuffled differently for every account and kept secret, so people do not all pile into "a" and the load spreads evenly. This holds in every region. Now spread your servers across several AZs, then trigger an outage.',
		singapore:
			'Notice the AZ names, <b>ap-southeast-1a</b>, <b>ap-southeast-1b</b>, and so on, always ending in a letter. The twist is that the letter is shuffled differently for every account and kept secret, so people do not all pile into "a" and the load spreads evenly. This holds in every region. Now spread your servers across several AZs, then trigger an outage.',
		down: 'There it is. Your server was in a single AZ, so when that AZ was hit your site went down with it. Spread to other AZs, then trigger it again.',
		survived: 'Feel the difference. One AZ falls, but the others keep serving, so your site survives. That is what spreading across AZs is for.'
	},
	worldHint: 'Click a region to see its Availability Zones',
	back: 'Back to the map',
	serverLabel: 'Server',
	place: 'Click an AZ to add or remove a server',
	trigger: 'Trigger an outage',
	statusUp: 'Online',
	statusDown: 'Down',
	activeZones: 'Active AZs',
	regions: { virginia: 'Virginia', singapore: 'Singapore' }
};
