import type { SharedResponsibilityText } from '../types';

export const en: SharedResponsibilityText = {
	title: 'Shared Responsibility',
	intro: [
		'Using the cloud does not make security entirely the provider job. There is a clear split, called the <b>shared responsibility model</b>.',
		'The provider secures <b>the cloud itself</b>: the physical data center buildings, the hardware, the virtualization layer (the hypervisor), and the global network. This part is out of your reach, and it is not your job.',
		'You secure <b>what you put in the cloud</b>: your data, who has access, your configuration, and your passwords. In fact, most breaches come from the customer side, not the provider, often from sloppy configuration or weak passwords.',
		'Try it. Sort each item into the right bucket: Provider or You.'
	],
	reactions: {
		correct: 'Exactly. You know who owns that piece.',
		wrong: 'Hmm, think again. Ask yourself: is this part of the cloud itself (the provider job) or something you put on top of it (your job)?'
	},
	providerLabel: 'Provider',
	providerSub: 'Secures the cloud',
	youLabel: 'You',
	youSub: 'Secure your stuff',
	prompt: 'Pick an item, then tap the bucket you think is responsible',
	done: 'All correct. That is how responsibility splits.',
	items: {
		datacenter: 'Physical data center security',
		hardware: 'Server hardware',
		hypervisor: 'The hypervisor',
		network: 'The global network',
		iam: 'Access permissions (IAM)',
		passwords: 'Your passwords',
		appPatch: 'Patching your app',
		dataConfig: 'Your data configuration'
	}
};
