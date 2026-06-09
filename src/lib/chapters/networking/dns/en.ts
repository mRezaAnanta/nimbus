import type { DnsText } from '../types';

export const en: DnsText = {
	title: 'IP and DNS',
	intro: [
		'Every server on the internet has an <b>IP address</b>, a string of numbers that says where it is, like a house number. For example 93.184.216.34. Your browser needs this number to connect.',
		'The trouble is, numbers are hard for people to remember. So we use friendly names like nimbus.dev instead. But computers still need the number.',
		'This is where <b>DNS</b> comes in. DNS is the internet phonebook: you give it a name and it hands back the IP address. Once the IP is known, your browser can connect to the right server.',
		'Try it. Pick a domain, watch DNS turn its name into an IP, then let the browser connect to that address.'
	],
	reactions: {
		resolved: 'There, DNS just translated that name into an IP address. Now the browser knows which number to connect to.',
		connected: 'Nice. The browser connected to that IP address and the page loaded. That is the journey from name to IP to connection.'
	},
	prompt: 'Pick a domain',
	resolveLabel: 'Look up IP (DNS)',
	connectLabel: 'Connect browser',
	resolverTitle: 'DNS resolver',
	resolving: 'Looking up',
	resolved: 'Found',
	connecting: 'Connecting',
	connected: 'Connected',
	ipLabel: 'IP address',
	again: 'Try another domain',
	domains: {
		'nimbus.dev': '93.184.216.34',
		'coffee-shop.com': '203.0.113.52',
		'cloud-class.com': '198.51.100.27'
	}
};
