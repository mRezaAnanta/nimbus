import type { FailoverText } from '../../types';

export const id: FailoverText = {
	title: 'Apa itu failover?',
	intro: [
		'Bayangkan website-mu cuma ditopang satu server utama. Kalau dia mati, ya sudah, semuanya ikut mati. Titik tunggal yang bisa menjatuhkan semuanya itu namanya <b>single point of failure</b>.',
		'Solusinya, siapkan <b>server cadangan</b> yang standby. Begitu yang utama tumbang, trafik otomatis pindah ke cadangan. Perpindahan otomatis ini namanya <b>failover</b>.',
		'Mirip ban serep, atau genset yang otomatis nyala pas listrik padam. Selalu ada pengganti yang siap.',
		'Coba sendiri. Sekarang cuma ada server utama. Matikan dia, lalu lihat yang terjadi.'
	],
	reactions: {
		spof: 'Nah, karena tidak ada cadangan, website-mu langsung mati begitu yang utama tumbang. Coba tambahkan server cadangan dulu, lalu matikan utamanya lagi.',
		failover: 'Lihat, begitu yang utama mati, trafik otomatis pindah ke cadangan dan website-mu tetap jalan. Itulah failover.'
	},
	primaryLabel: 'Server Utama',
	standbyLabel: 'Server Cadangan',
	serving: 'Melayani',
	standbyState: 'Siaga',
	failingOver: 'Pindah ke cadangan',
	kill: 'Matikan utama',
	addHint: 'Klik kotak cadangan untuk menyiapkannya',
	statusUp: 'Online',
	statusDown: 'Mati'
};
