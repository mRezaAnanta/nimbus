import type { TunnelingText } from '../../types';

export const en: TunnelingText = {
	title: 'Tunneling, a borrowed door',
	intro: [
		'The laptop failed as a public server. But before we jump to the big solution, there is a trick many developers use, called <b>tunneling</b>.',
		'The idea goes like this. Your laptop connects out first, to a server owned by a third party, most often <b>ngrok</b>. That outgoing connection becomes a private tunnel between your laptop and their server.',
		'The third party then lends you a public address. Anyone who opens it gets forwarded through that tunnel all the way to your laptop. A changing home IP no longer matters, because your laptop is the one dialing out, not the one being hunted down.',
		'It is perfect for demoing to a client or testing from your phone without uploading anything anywhere. But it stays a borrowed door. The address is random and changes every start, all traffic flows through someone else’s server, and the moment the laptop closes, it dies too.',
		'Try it yourself. Start the tunnel, open it from a friend’s phone, then close the laptop and watch what happens.'
	],
	reactions: {
		tunnel:
			'Tunnel up. Your laptop dialed out to the relay, which is why it works even with a shifting home IP. You got a borrowed public address.',
		visited:
			'Your friend’s request entered the relay, traveled down the tunnel to your laptop, and the answer came back the same way. That is tunneling.',
		closed:
			'Laptop closed and the tunnel collapsed with it, the public address died instantly. Great for demos, clearly not for a real site. And this is exactly where the cloud comes in.'
	},
	laptopLabel: 'Your laptop',
	localChip: 'app running locally',
	relayLabel: 'ngrok relay',
	relaySub: 'third party',
	friendLabel: 'Friend’s phone',
	publicUrl: 'abc123.ngrok.app',
	startTunnel: 'Start the tunnel',
	visit: 'Open from the friend’s phone',
	closeLaptop: 'Close the laptop',
	reset: 'Reset',
	tunnelOff: 'Tunnel down',
	tunnelOn: 'Tunnel up',
	noteIdle: 'Your laptop cannot be reached from outside yet',
	noteOn: 'The relay lends you a public address',
	noteVisit: 'In through the relay, down the tunnel, all the way to your laptop',
	noteClosed: 'The tunnel collapsed, and the borrowed address died with it'
};
