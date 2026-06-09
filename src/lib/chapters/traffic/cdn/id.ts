import type { CdnText } from '../types';

export const id: CdnText = {
	title: 'Caching dan CDN',
	intro: [
		'Ingat soal latensi di bab pertama? Makin jauh server, makin lama data sampai. Pengunjung di Jakarta yang mengambil dari server di Amerika harus menunggu perjalanan bolak balik yang panjang.',
		'Banyak hal sebenarnya tidak berubah tiap permintaan, misalnya gambar dan logo yang itu itu saja. Daripada mengambil ulang dari jauh terus, simpan salinannya di dekat pengunjung. Menyimpan salinan siap pakai ini namanya <b>caching</b>.',
		'<b>CDN</b> (Content Delivery Network) menaruh salinan tadi di banyak kota di seluruh dunia. Pengunjung dilayani dari titik terdekat, bukan dari server asal yang jauh.',
		'Coba kirim permintaan dengan CDN mati dulu, lihat berapa lama dari server asal yang jauh. Lalu nyalakan CDN dan kirim lagi, dilayani dari cache terdekat.'
	],
	reactions: {
		origin:
			'CDN masih mati, jadi permintaan harus jalan jauh sampai ke server asal dan kembali. Hitungannya ratusan milidetik. Nyalakan CDN, lalu kirim lagi.',
		cached:
			'Jauh lebih cepat. Salinan sudah ada di cache terdekat, jadi tidak perlu perjalanan jauh ke server asal. Cuma belasan milidetik. Itulah gunanya CDN.'
	},
	cdnOn: 'Nyalakan CDN',
	cdnOff: 'Matikan CDN',
	send: 'Kirim permintaan',
	originLabel: 'Server asal',
	edgeLabel: 'Cache terdekat',
	userLabel: 'Pengunjung',
	ms: 'ms',
	farNote: 'jalan jauh ke server asal',
	nearNote: 'dijawab dari cache terdekat',
	off: 'CDN mati',
	on: 'CDN nyala'
};
