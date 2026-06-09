import type { FirewallText } from '../types';

export const en: FirewallText = {
	title: 'Firewall',
	intro: [
		'Your server still needs a guard at the door. That is the <b>firewall</b>: it allows or denies incoming connections based on <b>port</b> (a numbered door) and <b>source</b> (which address the connection comes from).',
		'The safe rule is simple: <b>deny everything by default</b>, then open only what you truly need. Like a bouncer with a guest list: not on the list, not coming in.',
		'For example, web on port 443 is fine to open to the public. But SSH on port 22 from an unknown address, or a database on port 3306 from the open internet, is dangerous and should be denied.',
		'Try it. A few connections are knocking. Set allow or deny for each rule, then run the test. Your goal: allow the web traffic, block the risky ones.'
	],
	reactions: {
		web: 'Good. Web traffic on port 443 is meant for the public, so this rule is fine to allow.',
		ssh: 'Careful. SSH is admin access to your server. From an unknown address, it is safer to deny it.',
		db: 'That is dangerous. A database must never be open to the public internet. Deny this one.',
		secured: 'Nice. Web open, SSH and database denied. Deny everything first, open only what you need. That is a safe firewall.'
	},
	ruleHeader: 'Incoming connections',
	allow: 'Allow',
	deny: 'Deny',
	testLabel: 'Run the test',
	reset: 'Reset',
	succeeded: 'Connected',
	failed: 'Blocked',
	sourceLabel: 'Source',
	portLabel: 'Port',
	connections: {
		web: { name: 'Web traffic', source: 'internet (public)' },
		ssh: { name: 'SSH (admin access)', source: 'unknown address' },
		db: { name: 'Database', source: 'open internet' }
	}
};
