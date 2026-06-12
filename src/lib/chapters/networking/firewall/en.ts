import type { FirewallText } from '../types';

export const en: FirewallText = {
	title: 'Firewalls',
	intro: [
		'A door that opens to the internet gets visited by everyone, good guests and snoops alike. Someone has to screen them out front.',
		'The <b>firewall</b> is that security guard. It stands in front of the server holding a guest list, checking every arrival before they may enter.',
		'You write the rules, and the safest rules start from <b>deny everything</b>, then allow only what is needed. Say, guests coming to view the web page are welcomed, everyone else is turned away.',
		'Try it. Send in a web guest, then send in a snoop, and watch the guard work.'
	],
	reactions: {
		allow:
			'The web guest is on the list, so the guard opens the door. Your visitors never feel the check, yet it always happens.',
		deny: 'The snoop is not on the list and gets turned away at the door, before ever touching the server. That is a firewall, deny first, allow only what is needed.'
	},
	guardLabel: 'Firewall',
	guardSub: 'the guard at the door',
	serverLabel: 'Server',
	rulesTitle: 'Guest list',
	ruleAllow: 'Web guests, welcome in',
	ruleDeny: 'Everyone else, turn away',
	guestWeb: 'Web guest',
	guestBad: 'Snoop',
	sendWeb: 'Send a web guest',
	sendBad: 'Send a snoop',
	allowedTag: 'in',
	deniedTag: 'denied',
	noteIdle: 'The guard stands ready with the list',
	noteAllow: 'On the list, shown right in',
	noteDeny: 'Not on the list, stops right here'
};
