import type { CapstoneText } from '../types';

export const en: CapstoneText = {
	title: 'Final Project',
	intro: [
		'You made it to the end of Part 1. Now we bring every concept together into one whole system.',
		'Say you have a small online store. Right now it runs on a single server, fragile and easy to knock over.',
		'Your job is to complete this store using everything you learned, then stress it with a traffic surge and an outage. Start building.'
	],
	reactions: {
		multiaz: 'Your servers are now spread across several AZs. One data center falls, the others keep serving.',
		traffic: 'The load balancer splits traffic evenly, and auto scaling adds servers on its own when it gets busy.',
		cdn: 'Copies of your pages sit in many cities, so even far away visitors are served by a nearby cache, fast.',
		data: 'Your data has a replica ready to take over, plus a backup in case something gets deleted by accident.',
		security:
			'The database is hidden in a private subnet, the firewall closes the doors you do not need, and the data is scrambled with encryption.',
		monitoring: 'Now you can see the health of the system and get an alarm before visitors ever notice a problem.',
		tested:
			'Look at that. Visitors flood in, one AZ dies, an attack arrives, and your store stays ONLINE. You just designed a real system. Part 1 complete.'
	},
	caps: [
		{ key: 'multiaz', name: 'Spread across several AZs', recall: 'Chapter 3, Resilience & Data' },
		{ key: 'traffic', name: 'Load balancer and auto scaling', recall: 'Chapter 4, Traffic' },
		{ key: 'cdn', name: 'CDN and cache', recall: 'Chapter 4, Traffic' },
		{ key: 'data', name: 'Database with a replica and backup', recall: 'Chapter 3, Resilience & Data' },
		{ key: 'security', name: 'Private subnet, firewall, encryption', recall: 'Chapter 5, Networking & Security' },
		{ key: 'monitoring', name: 'Monitoring and alarms', recall: 'Chapter 6, Compute & Operations' }
	],
	addHint: 'Click each capability to bolt it onto your store',
	readiness: 'Readiness',
	runTest: 'Run the stress test',
	testing: 'Testing',
	online: 'ONLINE',
	appName: 'Nim Store',
	appWeak: 'one server, fragile',
	appReady: 'ready and resilient',
	testSteps: ['Traffic surge', 'Singapore AZ down', 'Attack blocked']
};
