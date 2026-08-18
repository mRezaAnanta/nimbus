import type { RequestJourneyText } from '../../types';

export const en: RequestJourneyText = {
	title: 'From your phone to the server',
	intro: [
		'You just saw the client ask and the server answer. But between your phone and that server lies a very long trip, and the whole thing finishes in the blink of an eye.',
		'The moment you tap open, your request leaves the phone over WiFi to the <b>router</b> in your house. The router is the front gate, every device in your home enters and leaves the internet through it.',
		'Out on the street on mobile data, the first hop is not a router but the nearest <b>cell tower</b>. This is the part that confuses people, if data travels on cables, what are those tall towers for? A cable cannot follow you around, so the very last stretch to your phone is bridged by radio waves, a few metres over WiFi, a few kilometres to a tower.',
		'And the waves stop right there. A router and a tower are both wired into fibre, and from either one your request is handed to your <b>ISP</b> (Internet Service Provider), through cables along the street, between cities, and later even the sea floor.',
		'At its destination, the server reads your request and sends an answer back along the very same road, all the way to the page on your screen. The round trip usually takes just tens of milliseconds.',
		'The route is laid out end to end, from your phone to the server at the far side. Pick whether you are on WiFi or mobile data, then open nimbus.com and follow your request along it.'
	],
	reactions: {
		arrived:
			'Your request reached the server, after one hop through the air and then the ISP and the global network over cable. Now the server prepares its answer.',
		back: 'And the answer came back along the same road until it became a page on your screen. That whole trip happens every time you open a website.',
		wifi: 'Over WiFi the waves only cross a few metres to the router. After that it is all cable.',
		cell: 'Over mobile data the waves cross a few kilometres to the tower. At the tower your data moves onto cable too, and the rest of the road is identical.'
	},
	openSite: 'Open nimbus.com',
	again: 'Travel again',
	modes: { wifi: 'Home WiFi', cell: 'Mobile data' },
	stations: {
		phone: 'Your phone',
		router: 'WiFi router',
		tower: 'Cell tower',
		isp: 'ISP',
		net: 'Global network',
		server: 'Server'
	},
	notes: {
		phone: 'You tap open, a request is born',
		router: 'It crosses as waves, a few metres to the router',
		tower: 'It crosses as waves to the nearest cell tower',
		isp: 'From here on it is cable, the ISP connects you to the wider world',
		net: 'It races through cables between cities and continents',
		server: 'The server receives it and prepares an answer',
		back: 'The answer takes the same road back to your phone'
	},
	requestTag: 'Request',
	responseTag: 'Answer',
	idleNote: 'Press the button and follow the trip',
	radioLabel: 'Radio waves',
	radioRange: { wifi: 'a few metres', cell: 'a few kilometres' },
	cableLabel: 'Cable, all the rest of the way'
};
