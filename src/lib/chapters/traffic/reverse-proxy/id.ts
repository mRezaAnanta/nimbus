import type { ReverseProxyText } from '../types';

export const id: ReverseProxyText = {
	title: 'Reverse proxy',
	intro: [
		'Situs jarang cuma satu server. Biasanya ada satu server buat halaman, satu lagi buat data, dan satu lagi buat gambar. Tiga server berbeda, ribet kalau pengunjung harus hafal semuanya.',
		'Makanya kita pasang satu penerima di depan, namanya <b>reverse proxy</b>. Semua permintaan masuk lewat dia, lalu dia yang meneruskan ke server yang tepat di belakang.',
		'Anggap dia resepsionis. Tiap tamu disambut di meja depan, lalu diantar ke ruangan yang benar. Tamu nggak pernah lihat kantor di belakang, dan cuma kenal satu alamat, yaitu <b>nimbus.com</b>.',
		'Coba sendiri. Minta halaman, data, atau gambar lewat <b>nimbus.com</b>, lalu lihat proxy mengantar tiap permintaan ke server yang tepat sementara alamat asli server tetap tersembunyi.'
	],
	reactions: {
		web: 'Permintaan ke <b>/</b> diantar ke server halaman, dan kamu dapat halaman webnya. Satu alamat di depan, sisanya proxy yang urus. Coba jalur lain.',
		api: 'Permintaan ke <b>/api</b> diteruskan ke server data, dan yang balik adalah data (JSON). Server beda, alamat depan tetap sama.',
		static:
			'Permintaan ke <b>/gambar</b> diantar ke server gambar, dan yang balik adalah gambar. Tiga tujuan berbeda, satu alamat yang sama.'
	},
	promptLabel: 'Ketuk untuk minta sesuatu lewat nimbus.com',
	youLabel: 'Kamu',
	proxyLabel: 'Reverse proxy',
	proxySub: 'nerima semua permintaan',
	publicAddr: 'nimbus.com',
	idleHint: 'Ketuk salah satu tombol di atas',
	hiddenLabel: 'tersembunyi',
	routes: [
		{ path: '/', label: 'Server halaman', backend: 'web', btn: 'Halaman', kind: 'page' },
		{ path: '/api', label: 'Server data', backend: 'api', btn: 'Data', kind: 'json' },
		{ path: '/gambar', label: 'Server gambar', backend: 'static', btn: 'Gambar', kind: 'image' }
	],
	routedNote: 'Diantar ke {n} server berbeda'
};
