import type { SharedResponsibilityText } from '../types';

export const en: SharedResponsibilityText = {
	title: 'Shared Responsibility',
	intro: [
		'One of the most common cloud misunderstandings, "it is in the cloud, so it must be secure". Not necessarily.',
		'Security in the cloud is split in two, called <b>shared responsibility</b>. The cloud provider guards <b>the building</b>, the physical data center, the hardware, and the network.',
		'You guard <b>what is inside</b>, your data, who gets access, the keys, and your own configuration. Most cloud breaches happen because of a customer misconfiguration, not because the provider got cracked.',
		'The split is ready. Unfold it and see who carries what.'
	],
	reactions: {
		shown:
			'Clear, right? The building and machines belong to the provider, the contents and keys belong to you. If your data leaks because access was left unlocked, that is not the cloud’s fault.'
	},
	providerTitle: 'Cloud provider',
	providerSub: 'guards the building',
	youTitle: 'You',
	youSub: 'guard what is inside',
	providerItems: ['The data center building', 'Hardware & machines', 'Network & power'],
	youItems: ['Your data', 'Who gets access', 'Keys & configuration'],
	reveal: 'Show the split',
	noteIdle: 'Two parties, two shares of the duty',
	noteDone: 'The building is theirs, the contents are yours'
};
