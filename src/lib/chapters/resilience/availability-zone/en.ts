import type { AZText } from '../../types';

export const en: AZText = {
	title: 'What is an Availability Zone?',
	intro: [
		'Real data centers have actually been attacked.',
		'And not just attacked. Fire, floods, earthquakes, lightning, even a wrong command, all have taken data centers down.',
		'Hardware fails too, a single disk or server can die at any time, but that is usually handled by redundancy inside the data center.',
		'The bigger danger is when a whole data center building falls. The question is, how does your site stay up when that happens?',
		'The answer is, a <b>region</b> is not a single building. Inside it are several separate data centers called <b>Availability Zones</b> (AZ), set far apart with their own power and network.',
		'Try it. Click a region to go inside, spread your servers across several AZs, then trigger an outage.'
	],
	reactions: {
		virginia:
			'Notice the AZ names, <b>us-east-1a</b>, <b>us-east-1b</b>, and so on, always ending in a letter. The twist is that the letter is shuffled differently for every account and kept secret, so people do not all pile into "a" and the load spreads evenly. This holds in every region. Now spread your servers across several AZs, then trigger an outage.',
		singapore:
			'Notice the AZ names, <b>ap-southeast-1a</b>, <b>ap-southeast-1b</b>, and so on, always ending in a letter. The twist is that the letter is shuffled differently for every account and kept secret, so people do not all pile into "a" and the load spreads evenly. This holds in every region. Now spread your servers across several AZs, then trigger an outage.',
		down: 'There it is. Your server was in a single AZ, so when that AZ was hit your site went down with it. Spread to other AZs, then trigger it again.',
		survived: 'Feel the difference. One AZ falls, but the others keep serving, so your site survives. That is what spreading across AZs is for.'
	},
	worldHint: 'Click a region to see its Availability Zones',
	back: 'Back to the map',
	serverLabel: 'Server',
	place: 'Click an AZ to add or remove a server',
	trigger: 'Trigger an outage',
	statusUp: 'Online',
	statusDown: 'Down',
	activeZones: 'Active AZs',
	regions: { virginia: 'Virginia', singapore: 'Singapore' },
	strikeLabel: 'Middle East',
	news: [
		{
			src: 'CNBC, 2026',
			head: 'Iranian drones strike AWS data centers in the Middle East',
			url: 'https://www.cnbc.com/2026/04/07/aws-iran-threats-us-tech-data-centers.html'
		},
		{
			src: 'Data Center Dynamics, 2021',
			head: 'Fire destroys the OVHcloud data center in Strasbourg',
			url: 'https://www.datacenterdynamics.com/en/news/fire-destroys-ovhclouds-sbg2-data-center-strasbourg/'
		},
		{
			src: 'Amazon Web Services, 2021',
			head: 'A major outage takes down the us-east-1 (Virginia) region',
			url: 'https://aws.amazon.com/message/12721/'
		},
		{
			src: 'Data Center Dynamics, 2022',
			head: 'London heatwave, cooling fails, cloud services go down',
			url: 'https://www.datacenterdynamics.com/en/news/googles-london-data-center-outage-during-heatwave-caused-by-simultaneous-failure-of-multiple-redundant-cooling-systems/'
		},
		{
			src: 'Data Center Dynamics, 2012',
			head: 'Hurricane Sandy floods data centers in New York',
			url: 'https://www.datacenterdynamics.com/en/news/hurricane-sandy-data-center-stories-from-manhattan/'
		},
		{
			src: 'Data Center Dynamics, 2015',
			head: "Lightning hits Google's Belgium data center, some data lost",
			url: 'https://www.datacenterdynamics.com/en/news/lightning-strikes-and-old-disks-cause-google-data-loss/'
		},
		{
			src: 'Engineering at Meta, 2021',
			head: 'A wrong command erased Facebook from the internet for six hours',
			url: 'https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/'
		},
		{
			src: 'Fastly, 2021',
			head: 'One config bug knocked major websites offline',
			url: 'https://www.fastly.com/blog/summary-of-june-8-outage'
		},
		{
			src: 'Data Center Dynamics, 2011',
			head: "Japan's quake, blackouts and fuel shortages strain data centers",
			url: 'https://www.datacenterdynamics.com/en/news/the-after-effect-of-the-japanese-earthquake/'
		}
	]
};
