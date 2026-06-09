import type { EncryptionText } from '../types';

export const en: EncryptionText = {
	title: 'Encryption',
	intro: [
		'Every message you send over the internet hops across many networks and machines before it arrives. All along that path, someone could quietly peek.',
		'<b>Encryption</b> scrambles your data into unreadable code. Only someone holding the <b>key</b> can turn it back. To a snooper, it is just random characters with no meaning.',
		'Your data needs protecting in two places: while it <b>travels</b> across the network (this is what HTTPS does, the little padlock in the address bar) and while it is <b>stored</b> on disk (so if the file is stolen, the contents stay safe).',
		'Try it. Send this message with encryption off first and watch the eavesdropper. Then turn encryption on and send it again.'
	],
	reactions: {
		plain: 'Ouch. With no encryption your message travels as plain text, and the eavesdropper reads it word for word. Now turn encryption on and send it again.',
		encrypted:
			'There we go. Your message is now scrambled code, so the eavesdropper only sees gibberish. Only the recipient, who holds the key, can read it.'
	},
	youLabel: 'You',
	recipientLabel: 'Recipient',
	eavesdropperLabel: 'Eavesdropper',
	messageLabel: 'Your message',
	encryptOff: 'Encryption off',
	encryptOn: 'Encryption on',
	sendLabel: 'Send message',
	plainTag: 'Plain text, readable',
	scrambledTag: 'Scrambled, safe',
	keyLabel: 'Has the key',
	noKeyLabel: 'No key',
	inTransitNote: 'In transit: HTTPS',
	atRestNote: 'At rest: encrypted on disk',
	sample: 'Account balance: 50,000 dollars'
};
