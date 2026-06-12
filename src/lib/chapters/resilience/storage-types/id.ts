import type { StorageTypesText } from '../types';

export const id: StorageTypesText = {
	title: 'Tiga bentuk penyimpanan',
	intro: [
		'Sekarang kita simpan data. Di cloud ada tiga bentuk penyimpanan, dan masing-masing cocok untuk hal yang berbeda.',
		'<b>Object storage</b> menyimpan file utuh, masing-masing diberi sebuah kunci, dan kapasitasnya seolah tanpa batas. Pas untuk foto, video, dan cadangan. <b>Block storage</b> adalah disk mentah yang dipasang ke satu mesin, cocok untuk database atau sistem operasi.',
		'<b>File storage</b> adalah folder bersama yang bisa dipasang banyak mesin sekaligus, jadi semuanya melihat berkas yang sama.',
		'Coba cocokkan. Pilih satu kebutuhan, lalu taruh di jenis penyimpanan yang paling pas.'
	],
	reactions: {
		correct: 'Pas. Itu memang rumahnya yang paling tepat.',
		wrong: 'Belum cocok. Pikirkan lagi: file utuh, satu disk untuk satu mesin, atau folder yang dipakai bersama?'
	},
	objectTitle: 'Object storage',
	objectSub: 'File utuh disimpan lewat kunci, kapasitas seolah tanpa batas',
	blockTitle: 'Block storage',
	blockSub: 'Disk mentah untuk satu mesin',
	fileTitle: 'File storage',
	fileSub: 'Folder bersama yang dipasang banyak mesin',
	prompt: 'Pilih satu kebutuhan di atas, lalu klik jenis penyimpanan yang pas.',
	done: 'Semua sudah cocok.',
	cases: {
		photos: 'Foto pengguna',
		backups: 'Cadangan harian',
		dbDisk: 'Disk database',
		osDisk: 'Disk sistem operasi',
		shared: 'Folder dokumen tim bersama'
	}
};
