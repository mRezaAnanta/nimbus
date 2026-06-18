import type { RequestJourneyText } from '../../types';

export const id: RequestJourneyText = {
	title: 'Dari HP sampai ke server',
	intro: [
		'Tadi kamu lihat client minta dan server menjawab. Tapi di antara HP-mu dan server itu ada perjalanan yang panjang banget, dan semuanya kelar dalam sekejap mata.',
		'Begitu kamu menekan buka, permintaanmu keluar dari HP lewat WiFi ke <b>router</b> di rumahmu. Router itu gerbang rumah, semua perangkat di rumahmu keluar masuk internet lewat dia.',
		'Dari router, permintaan diteruskan ke <b>ISP</b> (Internet Service Provider), penyedia internet langgananmu. ISP-lah yang menyambungkan rumahmu ke jaringan dunia, lewat kabel di pinggir jalan, antar kota, bahkan nanti dasar laut.',
		'Sampai di tujuannya, server membaca permintaanmu dan mengirim jawaban, lewat jalan yang sama, balik sampai jadi halaman di layar HP-mu. Bolak balik ini biasanya cuma puluhan milidetik.',
		'Jalurnya sudah terbentang lengkap, dari HP-mu sampai ke server di ujung sana. Buka nimbus.com dan ikuti permintaanmu menempuh perjalanan itu.'
	],
	reactions: {
		arrived:
			'Permintaanmu sampai di server, setelah lewat router rumah, ISP, dan jaringan dunia. Sekarang server menyiapkan jawabannya.',
		back: 'Dan jawabannya balik lewat jalan yang sama sampai jadi halaman di layarmu. Perjalanan sejauh itu terjadi tiap kali kamu buka website.'
	},
	openSite: 'Buka nimbus.com',
	again: 'Ulangi perjalanan',
	stations: {
		phone: 'HP kamu',
		router: 'Router WiFi',
		isp: 'ISP',
		net: 'Jaringan dunia',
		server: 'Server'
	},
	notes: {
		phone: 'Kamu menekan buka, permintaan dibuat',
		router: 'Router rumah meneruskannya ke luar',
		isp: 'ISP menyambungkan ke jaringan dunia',
		net: 'Melesat lewat kabel antar kota dan benua',
		server: 'Server menerima dan menyiapkan jawaban',
		back: 'Jawabannya menempuh jalan yang sama, balik ke HP-mu'
	},
	requestTag: 'Permintaan',
	responseTag: 'Jawaban',
	idleNote: 'Tekan tombolnya dan ikuti perjalanannya'
};
