import type { CostText } from '../types';

export const id: CostText = {
	title: 'Mengatur biaya',
	intro: [
		'Di cloud kamu bayar sesuai pakai. Enaknya di situ, bahayanya juga di situ, karena semua yang lupa dimatikan terus menagih diam diam.',
		'Dua penyakit tagihan paling umum, server <b>nganggur</b> yang menyala tanpa kerjaan, dan server <b>kebesaran</b> yang tenaganya cuma kepakai sedikit.',
		'Obatnya namanya <b>right sizing</b>, sesuaikan ukuran dengan kebutuhan nyata. Matikan yang nganggur, kecilkan yang kebesaran, dan tagihanmu langsung kurus tanpa situsmu terganggu.',
		'Tagihan bulan ini lagi bengkak, dan dua pemborosannya bersembunyi di antara tiga server itu. Bereskan keduanya dan lihat angkanya menyusut.'
	],
	reactions: {
		off: 'Satu server nganggur dimatikan, tiga puluh dolar langsung balik ke kantong tiap bulan. Di perusahaan sungguhan, pemborosan beginilah yang paling sering kejadian.',
		resize:
			'Mesin kebesaran dikecilkan menjadi pas, kerjanya tetap beres, harganya jauh lebih murah. Itulah right sizing.'
	},
	billLabel: 'Tagihan bulan ini',
	perMonth: 'per bulan',
	idleName: 'Server uji coba',
	idleSub: 'nyala terus, kepakai 2%',
	bigName: 'Server laporan',
	bigSub: 'gede banget, kepakai 15%',
	rightName: 'Server web',
	rightSub: 'ukurannya pas',
	turnOff: 'Matikan',
	downsize: 'Kecilkan',
	offTag: 'mati, $0',
	resizedTag: 'pas sekarang',
	savedTag: 'hemat ${n}',
	noteIdle: 'Ada dua pemborosan bersembunyi di tagihan ini',
	noteOff: 'Yang nganggur tidak menagih lagi',
	noteResize: 'Yang kebesaran sekarang pas',
	noteDone: 'Tagihan kurus, situs tetap jalan'
};
