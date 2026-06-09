import type { ServerlessText } from '../types';

export const id: ServerlessText = {
	title: 'Apa itu serverless?',
	intro: [
		'Server biasa menyala terus, 24 jam. Masalahnya, dia tetap memakan biaya walau lagi sepi tanpa satu pengunjung pun. Kamu bayar waktu menganggurnya.',
		'Ada cara lain. Kamu cukup menulis sebuah <b>fungsi</b>, dan platform yang menjalankannya saat ada permintaan. Tidak ada trafik, tidak ada yang jalan, dan biayanya nol. Ini namanya <b>serverless</b>, dan kamu bayar per panggilan.',
		'Bayangkan lampu dengan sensor gerak. Dia mati selama tidak ada orang. Begitu ada yang lewat, langsung menyala, lalu padam lagi sendiri. Tidak ada listrik terbuang buat ruangan kosong.',
		'Coba sendiri. Di kiri ada server yang selalu menyala, biayanya jalan terus. Di kanan serverless. Kirim beberapa permintaan dan perhatikan kapan biayanya bergerak.'
	],
	reactions: {
		idle: 'Lihat server yang selalu menyala itu. Tanpa satu pun pengunjung, biayanya tetap naik. Sekarang coba kirim permintaan ke sisi serverless.',
		invoke: 'Nah, permintaan datang, fungsi langsung menyala, mengerjakan tugasnya, lalu turun lagi ke nol. Biaya cuma bergerak saat benar-benar dipanggil. Sepi berarti gratis.'
	},
	alwaysOnTitle: 'Server selalu menyala',
	alwaysOnSub: 'menyala 24 jam, walau sepi',
	serverlessTitle: 'Serverless',
	serverlessSub: 'jalan saat dipanggil, lalu turun ke nol',
	sendRequest: 'Kirim permintaan',
	idleLabel: 'Menganggur',
	runningLabel: 'Jalan',
	zeroLabel: 'Nol, tidur',
	costLabel: 'Biaya',
	tickHint: 'Biaya idle terus berjalan',
	invokeHint: 'Biaya cuma saat dipanggil',
	functionLabel: 'Fungsimu',
	requestLabel: 'permintaan'
};
