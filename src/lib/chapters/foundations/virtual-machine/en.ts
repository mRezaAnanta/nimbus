import type { VirtualMachineText } from '../../types';

export const en: VirtualMachineText = {
	title: 'What is a virtual machine?',
	intro: [
		'Look at this laptop. Inside there is just one machine, CPU, RAM, and disk. And usually one machine runs one system for one user.',
		'Yet a powerful machine sits idle most of the time, only a sliver of its power gets used. The trick is to slice one machine into several virtual computers. Each slice is called a <b>virtual machine</b> (VM).',
		'Every VM runs its own operating system and feels like a whole computer, even though they all share one set of hardware. Like an apartment building, one structure, many units, every resident with their own door. Hold on to this idea, it becomes the key very soon.',
		'Try it yourself. Split the screen, add VMs one by one until it is full, and watch the CPU and RAM get divided up.'
	],
	reactions: {
		first:
			'See, VM 1 instantly got its own share, 2 vCPU and 4 GB, complete with its own operating system. It believes it is a whole computer, yet it is only a slice.',
		more: 'Keep going. Every VM gets an equal slice of the power and none of them can peek at the others, exactly like neighboring apartment units.',
		full: 'Full. One physical machine now holds 4 computers standing on their own, and the power that used to sit idle is all put to work. This is the trick used everywhere.'
	},
	hostLabel: 'One physical machine',
	hostCpu: '8 vCPU',
	hostRam: '16 GB RAM',
	singleLabel: 'One system',
	singleSub: 'all the power for a single user',
	addVm: 'Add a VM',
	vmName: 'VM {n}',
	vmSub: 'own OS',
	perVm: 'Each VM 2 vCPU, 4 GB',
	usedLabel: 'Power in use {n}%',
	fullLabel: '4 computers in 1 machine',
	prompt: 'Slots still empty, keep splitting the machine'
};
