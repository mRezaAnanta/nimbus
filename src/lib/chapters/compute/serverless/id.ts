import type { ServerlessText } from '../types';

export const id: ServerlessText = {
	title: 'Serverless',
	intro: [
		'Kadang kamu cuma butuh sepotong kode yang jalan sesekali, kirim email OTP, resize foto, terima webhook pembayaran. Kalau pakai server biasa, dia menyala 24 jam dan meterannya jalan terus, padahal kerjanya cuma sesekali.',
		'Arsitektur <b>serverless</b> membereskan itu. Ikuti alurnya. Permintaan datang ke gerbang penyedia, penyedia menyalakan sebuah sandbox kecil dalam sekejap, fungsimu jalan di dalamnya, selesai, kotaknya langsung dimatikan. Sepi berarti benar benar nol.',
		'Sandbox itu bukan sihir. AWS Lambda menyalakan micro VM bernama <b>Firecracker</b>, Google Cloud memakai <b>gVisor</b>. Dua duanya menyala dalam sepersekian detik, makanya penyedia berani mulai dari nol.',
		'Coba kirim permintaan dari HP dan lihat fungsinya bangun, kerja, lalu tidur lagi. Ini baru kulit luarnya saja, nanti ada bab sendiri yang menyelam jauh lebih dalam ke dunia serverless.'
	],
	reactions: {
		invoked:
			'Lihat, fungsinya bangun cuma karena dipanggil, kerja sebentar, selesai. Tidak ada server yang kamu urus, dan meterannya cuma menghitung panggilan.',
		zero: 'Dan begitu sepi, dia tidur lagi ke nol. Tidak ada tagihan diam diam yang jalan semalaman. Itulah daya tarik serverless.'
	},
	fnLabel: 'fungsi kirimOTP',
	sleepTag: 'tidur, nol biaya',
	wakeTag: 'bangun',
	runTag: 'kerja',
	send: 'Panggil fungsinya',
	callsLabel: 'Terpanggil {n}×, bayar per panggilan',
	userLabel: 'HP pengguna',
	reqTag: 'permintaan',
	resTag: 'OTP terkirim',
	alwaysName: 'Server biasa',
	alwaysTag: 'menagih 24 jam, kerja sesekali',
	archSteps: ['Permintaan datang', 'Gerbang penyedia', 'Sandbox menyala', 'Fungsimu jalan', 'Langsung dimatikan'],
	behindItems: ['Firecracker, micro VM punya AWS', 'gVisor, sandbox punya Google'],
	noteIdle: 'Fungsinya tidur, tidak menagih sepeser pun',
	noteRun: 'Bangun sekejap, kerja, lalu pamit',
	noteZero: 'Balik tidur ke nol lagi'
};
