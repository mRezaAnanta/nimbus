import type { RequestJourneyText } from '../../types';

export const en: RequestJourneyText = {
	title: 'From your phone to the server',
	intro: [
		'You just saw the client ask and the server answer. But between your phone and that server lies a very long trip, and the whole thing finishes in the blink of an eye.',
		'The moment you tap open, your request leaves the phone over WiFi to the <b>router</b> in your house. The router is the front gate, every device in your home enters and leaves the internet through it.',
		'From the router, the request is handed to your <b>ISP</b> (Internet Service Provider), the internet company you pay every month. The ISP is what connects your house to the wider world, through cables along the street, between cities, and later even the sea floor.',
		'At its destination, the server reads your request and sends an answer back along the very same road, all the way to the page on your screen. The round trip usually takes just tens of milliseconds.',
		'The route is laid out end to end, from your phone to the server at the far side. Open nimbus.com and follow your request along it.'
	],
	reactions: {
		arrived:
			'Your request reached the server, after passing your home router, the ISP, and the global network. Now the server prepares its answer.',
		back: 'And the answer came back along the same road until it became a page on your screen. That whole trip happens every time you open a website.'
	},
	openSite: 'Open nimbus.com',
	again: 'Travel again',
	stations: {
		phone: 'Your phone',
		router: 'WiFi router',
		isp: 'ISP',
		net: 'Global network',
		server: 'Server'
	},
	notes: {
		phone: 'You tap open, a request is born',
		router: 'Your home router forwards it out',
		isp: 'The ISP connects you to the wider world',
		net: 'It races through cables between cities and continents',
		server: 'The server receives it and prepares an answer',
		back: 'The answer takes the same road back to your phone'
	},
	requestTag: 'Request',
	responseTag: 'Answer',
	idleNote: 'Press the button and follow the trip'
};
