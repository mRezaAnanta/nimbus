import type { VirtualMachineText } from '../types';

export const en: VirtualMachineText = {
	title: 'What is a virtual machine?',
	intro: [
		'One physical server is a big, powerful machine. Using it for a single small task is a waste, much of its power just sits idle.',
		'The trick is to slice one server into several separate virtual computers. Each slice is a <b>virtual machine</b> (VM). Every VM runs its own operating system and feels like a whole computer, even though they all share the same real hardware.',
		'Picture an apartment building. One building, but many separate units inside. Each resident has their own door, kitchen, and rooms, without disturbing the neighbors.',
		'Try it. This server has a pool of CPU and RAM. Create a few VMs and split the resources between them. Just be careful not to hand out more than there is.'
	],
	reactions: {
		created: 'Nice, one VM is running with its own slice of resources. Try adding another that still fits in what is left.',
		overcommit: 'There it is. You promised more than the server actually has, so the VMs fight over resources and slow down. Dial the slices back so everything fits.'
	},
	hostLabel: 'Physical server',
	hostSub: 'one set of hardware, shared',
	cpuLabel: 'CPU',
	ramLabel: 'RAM',
	freeLabel: 'Free',
	usedLabel: 'Used',
	addVm: 'Create VM',
	vmName: 'VM {n}',
	osLabel: 'own OS',
	runningLabel: 'Running',
	slowLabel: 'Slowing down',
	overHint: 'Over-allocated, VMs are contending',
	fitHint: 'Drag the sliders to split CPU and RAM across the VMs'
};
