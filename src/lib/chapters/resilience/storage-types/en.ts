import type { StorageTypesText } from '../types';

export const en: StorageTypesText = {
	title: 'Three shapes of storage',
	intro: [
		'Now we store data. The cloud offers three shapes of storage, and each one fits a different job.',
		'<b>Object storage</b> keeps whole files, each one stored by a key, with capacity that is effectively unlimited. Great for photos, videos, and backups. <b>Block storage</b> is a raw disk attached to one machine, ideal for a database or an operating system.',
		'<b>File storage</b> is a shared folder that many machines can mount at once, so they all see the same files.',
		'Try matching them. Pick a use case, then drop it on the storage type that fits best.'
	],
	reactions: {
		correct: 'Spot on. That is exactly where it belongs.',
		wrong: 'Not quite. Think again: a whole file, one disk for one machine, or a folder shared by many?'
	},
	objectTitle: 'Object storage',
	objectSub: 'Whole files stored by a key, effectively unlimited',
	blockTitle: 'Block storage',
	blockSub: 'A raw disk for one machine',
	fileTitle: 'File storage',
	fileSub: 'A shared folder many machines mount',
	prompt: 'Pick a use case above, then click the storage type that fits.',
	done: 'Everything is matched.',
	cases: {
		photos: 'User photos',
		backups: 'Daily backups',
		dbDisk: 'Database disk',
		osDisk: 'Operating system disk',
		shared: 'Shared team documents'
	}
};
