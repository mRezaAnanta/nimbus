import type { CloudServicesText } from '../../types';

export const en: CloudServicesText = {
	title: 'Cloud services',
	intro: [
		'So far you have rented a single server in the cloud. That virtual server is the most basic service. People often call it a <b>VPS</b>, and its cloud version that you can resize anytime is named <b>EC2</b> on AWS, <b>Compute Engine</b> on Google, <b>Virtual Machines</b> on Azure.',
		'The thing is, a bare server is empty. Want a database, a place for files, or anything else, you have to install it yourself and then keep it healthy yourself.',
		'So providers built many ready made services. Every need has its service, and the provider handles the setup, backups, and upkeep, you just rent it and use it. Like renting a fully fitted kitchen instead of building one from scratch.',
		'There are hundreds of these. Turn on the screen and see for yourself.',
		'[fyi] Later on you will keep running into AWS service names, and it turns out there is a pattern. Some start with <b>Amazon</b>, some with <b>AWS</b>. The <b>Amazon</b> ones are usually whole products you use on their own, like <b>Amazon EC2</b> (a server) or <b>Amazon S3</b> (a place to store files). The <b>AWS</b> ones are usually tools that work together with other services, like <b>AWS Lambda</b> that runs your code without you managing a server. This is not an official rule, just a pattern people notice.'
	],
	reactions: {
		open: 'Look, storage, databases, networking, even analytics and AI, all from AWS, Google, and Azure. The cloud is a giant catalog. In the chapters ahead we will meet the important ones one by one.'
	},
	screenTitle: 'Cloud services',
	screenSub: 'hundreds of services to rent',
	openBtn: 'Turn on the screen'
};
