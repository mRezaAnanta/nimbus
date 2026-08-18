import type { RequestJourneyText } from '../../types';

export const id: RequestJourneyText = {
	title: 'Dari HP sampai ke server',
	intro: [
		'Tadi kamu lihat client minta dan server menjawab. Tapi di antara HP-mu dan server itu ada perjalanan yang panjang banget, dan semuanya kelar dalam sekejap mata.',
		'Begitu kamu menekan buka, permintaanmu keluar dari HP lewat WiFi ke <b>router</b> di rumahmu. Router itu gerbang rumah, semua perangkat di rumahmu keluar masuk internet lewat dia.',
		'Kalau kamu lagi di jalan dan pakai data seluler, lompatan pertamanya bukan ke router, tapi ke <b>tiang BTS</b> terdekat. Ini yang sering bikin bingung, katanya data jalan lewat kabel, lah tiang tinggi itu buat apa? Soalnya kabel nggak bisa ikut kamu jalan, jadi potongan paling ujung ke HP-mu dijembatani gelombang radio, lewat WiFi cuma beberapa meter, lewat BTS beberapa kilometer.',
		'Dan gelombangnya cuma sampai situ. Router maupun tiang BTS dua duanya disambung kabel serat optik, terus permintaanmu diteruskan ke <b>ISP</b> (Internet Service Provider), penyedia internet langgananmu, lewat kabel di pinggir jalan, antar kota, bahkan nanti dasar laut.',
		'Sampai di tujuannya, server membaca permintaanmu dan mengirim jawaban, lewat jalan yang sama, balik sampai jadi halaman di layar HP-mu. Bolak balik ini biasanya cuma puluhan milidetik.',
		'Jalurnya sudah terbentang lengkap, dari HP-mu sampai ke server di ujung sana. Pilih dulu kamu lagi pakai WiFi atau data seluler, lalu buka nimbus.com dan ikuti permintaanmu menempuh perjalanan itu.'
	],
	reactions: {
		arrived:
			'Permintaanmu sampai di server, setelah satu lompatan gelombang tadi, lalu ISP dan jaringan dunia lewat kabel. Sekarang server menyiapkan jawabannya.',
		back: 'Dan jawabannya balik lewat jalan yang sama sampai jadi halaman di layarmu. Perjalanan sejauh itu terjadi tiap kali kamu buka website.',
		wifi: 'Lewat WiFi, gelombangnya cuma nyeberang beberapa meter sampai router. Habis itu semuanya kabel.',
		cell: 'Lewat data seluler, gelombangnya nyeberang beberapa kilometer ke tiang BTS. Sampai di tiang, datamu masuk ke kabel juga, sisa jalurnya sama persis.'
	},
	openSite: 'Buka nimbus.com',
	again: 'Ulangi perjalanan',
	modes: { wifi: 'WiFi rumah', cell: 'Data seluler' },
	stations: {
		phone: 'HP kamu',
		router: 'Router WiFi',
		tower: 'Tiang BTS',
		isp: 'ISP',
		net: 'Jaringan dunia',
		server: 'Server'
	},
	notes: {
		phone: 'Kamu menekan buka, permintaan dibuat',
		router: 'Nyeberang jadi gelombang, beberapa meter sampai router',
		tower: 'Nyeberang jadi gelombang ke tiang BTS terdekat',
		isp: 'Dari sini semuanya kabel, ISP menyambungkan ke jaringan dunia',
		net: 'Melesat lewat kabel antar kota dan benua',
		server: 'Server menerima dan menyiapkan jawaban',
		back: 'Jawabannya menempuh jalan yang sama, balik ke HP-mu'
	},
	requestTag: 'Permintaan',
	responseTag: 'Jawaban',
	idleNote: 'Tekan tombolnya dan ikuti perjalanannya',
	radioLabel: 'Gelombang radio',
	radioRange: { wifi: 'beberapa meter', cell: 'beberapa kilometer' },
	cableLabel: 'Kabel, sisanya sampai server'
};
