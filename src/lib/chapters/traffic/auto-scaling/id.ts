import type { AutoScalingText } from '../types';

export const id: AutoScalingText = {
	title: 'Auto scaling',
	intro: [
		'Scaling horizontal keren, tapi berapa server yang harus kamu siapkan? Kalau sedikit, kewalahan pas ramai. Kalau banyak terus, kamu bayar mahal padahal malam hari sepi.',
		'Trafik itu naik turun sepanjang hari. Tengah malam sepi, siang hari ramai. Sayang banget kalau jumlah servernya tetap segitu terus.',
		'<b>Auto scaling</b> menambah dan mengurangi server otomatis mengikuti permintaan. Ramai, server nambah sendiri. Sepi, server dikurangi sendiri. Kamu cuma bayar yang benar benar jalan.',
		'Tekan tombol play dan lihat satu hari penuh berputar. Perhatikan jumlah server mengikuti kurva trafik naik turun, dan meteran biaya ikut bergerak.'
	],
	reactions: {
		'scaled-up':
			'Lihat, trafik memuncak di siang hari dan server otomatis nambah sampai penuh. Tidak ada yang kewalahan, dan biayanya naik cuma pas dibutuhkan.',
		'scaled-down':
			'Malam tiba, trafik turun, dan server otomatis dikurangi lagi. Biayanya ikut turun. Kamu cuma bayar yang sedang jalan.'
	},
	play: 'Putar satu hari',
	running: 'Berputar...',
	again: 'Putar lagi',
	serversLabel: 'Server: {n}',
	costLabel: 'Biaya',
	trafficLabel: 'Trafik 24 jam',
	night: 'malam, sepi',
	midday: 'siang, ramai',
	payNote: 'Server mengikuti trafik otomatis, jadi kamu bayar sesuai pemakaian.'
};
