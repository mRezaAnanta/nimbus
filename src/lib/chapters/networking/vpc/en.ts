import type { NetworkText } from '../types';

export const en: NetworkText = {
	title: 'Private networks and subnets',
	intro: [
		'In the cloud you get your own private network, fenced off from everyone else. It is called a <b>VPC</b>, a Virtual Private Cloud. Picture a building that belongs only to you.',
		'The building is split into floors called <b>subnets</b>. A <b>public subnet</b> can be reached from the internet, like a lobby open to visitors. That suits a web server.',
		'A <b>private subnet</b> can only be reached from inside, like a staff only floor. That suits a database, since its contents should not be open to just anyone.',
		'Set it up yourself. Place the web server and the database in the subnets you think fit, then press test from the internet to see what is reachable.'
	],
	reactions: {
		exposed: 'Careful, your database is in the public subnet, so anyone on the internet can reach it. That is exposed. Move the database into the private subnet.',
		secured: 'That fits. Web server public so visitors can open your site, database private so it stays hidden from the internet. Only internal paths can touch it.'
	},
	vpcLabel: 'VPC (your private network)',
	publicLabel: 'Public subnet',
	publicSub: 'lobby, open from the internet',
	privateLabel: 'Private subnet',
	privateSub: 'staff floor, internal only',
	webLabel: 'Web server',
	dbLabel: 'Database',
	placeWeb: 'Place the web server here',
	placeDb: 'Place the database here',
	testLabel: 'Test from the internet',
	reachable: 'Reachable',
	blocked: 'Protected',
	exposedNote: 'Database open to the internet',
	securedNote: 'Secure setup',
	reset: 'Reset'
};
