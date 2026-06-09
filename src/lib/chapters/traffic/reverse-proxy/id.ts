import type { ReverseProxyText } from '../types';

export const id: ReverseProxyText = {
	title: 'Reverse proxy',
	intro: [
		'Sebuah situs jarang cuma satu server. Biasanya ada server khusus halaman web, server lain buat aplikasi, dan server lagi buat file seperti gambar. Tiga alamat berbeda, ribet kalau pengunjung harus tahu semuanya.',
		'Jadi kita pasang satu pintu depan: <b>reverse proxy</b>. Semua permintaan masuk lewat dia. Dia yang lihat tujuannya, lalu meneruskan ke server yang tepat di belakang.',
		'Anggap dia resepsionis. Setiap tamu disambut di meja depan, lalu diantar ke ruangan yang benar. Tamu tidak pernah lihat kantor di belakang, dan cuma kenal satu alamat: alamat resepsionis.',
		'Coba kirim beberapa permintaan dengan jalur berbeda. Lihat proxy mengantar tiap permintaan ke server yang tepat, sementara alamat asli server tetap tersembunyi.'
	],
	reactions: {
		web: 'Permintaan ke <b>/</b> diantar ke server halaman web. Pengunjung cuma tahu satu alamat, sisanya proxy yang urus. Coba jalur lain.',
		api: 'Permintaan ke <b>/api</b> diteruskan ke server aplikasi. Server beda, alamat tetap sama di depan.',
		static:
			'Permintaan ke <b>/gambar</b> diantar ke server file. Tiga tujuan berbeda, satu pintu depan yang sama.'
	},
	proxyLabel: 'Reverse proxy',
	proxySub: 'pintu depan publik',
	publicAddr: 'situsku.com',
	hiddenLabel: 'alamat tersembunyi',
	send: 'Kirim',
	routes: [
		{ path: '/', label: 'Server web', backend: 'web' },
		{ path: '/api', label: 'Server aplikasi', backend: 'api' },
		{ path: '/gambar', label: 'Server file', backend: 'static' }
	],
	backends: { web: 'Server web', api: 'Server aplikasi', static: 'Server file' },
	routedNote: 'Diantar ke {n} server berbeda'
};
