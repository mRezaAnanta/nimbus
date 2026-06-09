import type { CapstoneText } from '../types';

export const id: CapstoneText = {
	title: 'Proyek Akhir',
	intro: [
		'Selamat, kamu sampai di ujung Bagian 1. Semua konsep tadi, sekarang kita satukan jadi satu sistem utuh.',
		'Anggap kamu punya satu toko online kecil. Sekarang dia jalan cuma di satu server, rapuh dan gampang tumbang.',
		'Tugasmu, lengkapi toko ini pakai semua yang sudah kamu pelajari, lalu uji dengan lonjakan pengunjung dan satu gangguan. Mulai rangkai.'
	],
	reactions: {
		multiaz: 'Server-mu sekarang tersebar di beberapa AZ. Satu data center tumbang, yang lain tetap melayani.',
		traffic: 'Load balancer membagi trafik rata, dan auto scaling menambah server sendiri pas ramai.',
		cdn: 'Salinan halaman ada di banyak kota. Pengunjung jauh pun ditolong cache terdekat, jadi cepat.',
		data: 'Datamu punya replika yang siap ambil alih, plus backup kalau ada yang tidak sengaja terhapus.',
		security: 'Database disembunyikan di subnet privat, firewall menutup pintu yang tidak perlu, dan datanya diacak dengan enkripsi.',
		monitoring: 'Sekarang kamu bisa melihat kesehatan sistem dan dapat alarm sebelum pengunjung sadar ada masalah.',
		tested:
			'Lihat itu. Pengunjung membludak, satu AZ mati, serangan datang, dan tokomu tetap ONLINE. Kamu baru saja merancang sistem yang sungguhan. Bagian 1 selesai.'
	},
	caps: [
		{ key: 'multiaz', name: 'Sebar ke beberapa AZ', recall: 'Bab 2, Ketahanan' },
		{ key: 'traffic', name: 'Load balancer dan auto scaling', recall: 'Bab 3, Lalu Lintas' },
		{ key: 'cdn', name: 'CDN dan cache', recall: 'Bab 3, Lalu Lintas' },
		{ key: 'data', name: 'Database dengan replika dan backup', recall: 'Bab 5, Penyimpanan' },
		{ key: 'security', name: 'Subnet privat, firewall, enkripsi', recall: 'Bab 6 dan 7' },
		{ key: 'monitoring', name: 'Monitoring dan alarm', recall: 'Bab 8, Operasi' }
	],
	addHint: 'Klik tiap kemampuan untuk memasangnya ke tokomu',
	readiness: 'Kesiapan',
	runTest: 'Jalankan uji beban',
	testing: 'Menguji',
	online: 'ONLINE',
	appName: 'Toko Nim',
	appWeak: 'satu server, rapuh',
	appReady: 'siap dan tahan gangguan',
	testSteps: ['Lonjakan pengunjung', 'AZ Singapura mati', 'Serangan diblokir']
};
