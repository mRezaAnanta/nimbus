import type { ServerText } from '../../types';

export const en: ServerText = {
	title: 'What is a server?',
	intro: [
		'Every time you open a website, one computer somewhere sends that page to your screen.',
		'That computer is a <b>server</b>. Unlike your laptop, it stays on 24/7 and has just one job: serving visitors’ requests.',
		'To make it concrete, try it: click <b>Open website</b> on the left and watch what the server does.'
	],
	reactions: {
		served: 'That is what just happened: your phone <b>requested</b> the page, and the server <b>sent</b> it back. That is the whole core of a server.'
	},
	you: 'You',
	server: 'Server',
	open: 'Open website',
	request: 'request page',
	response: 'send page',
	count: 'Served {n}×'
};
