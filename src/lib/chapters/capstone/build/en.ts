import type { CapstoneText } from '../types';

export const en: CapstoneText = {
	title: 'Pick your track',
	intro: [
		'You made it to the end of Part 1. From one laptop server to an architecture that takes a punch, you now hold all the big concepts.',
		'Part 2 descends into the real world, provider by provider. The exact same concepts, wearing their real names and buttons, EC2, Cloud Run, and friends.',
		'Pick the provider you want to learn first. All three are still under construction, and you can leave an email to be told the moment your track is ready.'
	],
	reactions: {
		picked:
			'Noted! That track is being carefully prepared. Meanwhile, the concepts in Part 1 are the same foundation for every provider, so you are already a step ahead.',
		subscribed:
			'Your email is saved. The moment your track ships, you hear it first. See you in Part 2!'
	},
	providers: [
		{ key: 'aws', name: 'AWS', sub: 'Amazon Web Services' },
		{ key: 'gcp', name: 'Google Cloud', sub: 'GCP' },
		{ key: 'azure', name: 'Azure', sub: 'Microsoft Azure' }
	],
	comingSoon: 'Coming soon',
	pickedTag: 'your pick',
	newsTitle: 'Want a heads up?',
	newsSub: 'The tracks are still being built. Leave an email and we will write the moment yours is ready.',
	emailPh: 'your email',
	subscribe: 'Notify me',
	subscribedMsg: 'Saved! See you in Part 2',
	invalidMsg: 'Hmm, check that email again',
	errMsg: 'Hiccup on our side, try again shortly',
	noteIdle: 'Three big providers, one shared foundation',
	notePicked: 'Your track is still under construction, hang tight'
};
