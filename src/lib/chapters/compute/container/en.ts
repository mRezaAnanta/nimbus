import type { ContainerText } from '../types';

export const en: ContainerText = {
	title: 'What is a container?',
	intro: [
		'An app needs a lot around it to run: a language runtime, libraries, config files. Move it to another machine, forget one thing, and it breaks. The classic line: "but it works on my laptop".',
		'The fix is to package the app together with everything it needs into one neat bundle. That bundle is a <b>container</b>. Once built, it runs exactly the same anywhere.',
		'Think of a standardized shipping container at a port. The contents vary, but the outside is uniform. Lift it onto any ship or any truck and it just fits. A container is far lighter and faster to start than a VM, because it shares the server operating system kernel instead of booting a whole OS of its own.',
		'Try it. Build your app into one image, then run an identical copy on a different server.'
	],
	reactions: {
		shipped: 'There you go, built once, your app becomes a single image ready to ship. Now run that same image on another server.',
		scaled: 'See, the exact same image runs on two servers without changing a thing. That is the power of containers: package once, run anywhere, and start instantly.'
	},
	buildLabel: 'Build image',
	buildHint: 'Package the app plus its dependencies into one image',
	imageLabel: 'Image ready',
	runHere: 'Run here',
	hostLabel: 'Server {n}',
	vmTitle: 'Virtual machine',
	vmSub: 'each copy boots a full OS first',
	vmSize: 'Heavy (GB)',
	vmBoot: 'Slow boot',
	containerTitle: 'Container',
	containerSub: 'shares the server OS, starts instantly',
	containerSize: 'Light (MB)',
	containerBoot: 'Starts instantly',
	bootingOs: 'Booting OS...',
	appLabel: 'App',
	depsLabel: 'Dependencies',
	runningHere: 'Running here'
};
