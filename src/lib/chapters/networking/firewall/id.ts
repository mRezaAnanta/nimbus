import type { FirewallText } from '../types';

export const id: FirewallText = {
	title: 'Firewall',
	intro: [
		'Server-mu tetap perlu penjaga di depan pintu. Itulah <b>firewall</b>: ia mengizinkan atau menolak koneksi yang masuk berdasarkan <b>port</b> (semacam pintu bernomor) dan <b>sumber</b> (dari alamat mana koneksi datang).',
		'Aturan amannya sederhana: <b>tolak semua secara default</b>, lalu buka hanya yang benar-benar kamu butuhkan. Mirip bouncer dengan daftar tamu: tidak ada di daftar, tidak boleh masuk.',
		'Misalnya web di port 443 wajar dibuka untuk umum. Tapi SSH di port 22 dari alamat tak dikenal, atau database di port 3306 dari internet terbuka, itu berbahaya dan sebaiknya ditolak.',
		'Coba sendiri. Beberapa koneksi sedang mengetuk pintu. Atur izinkan atau tolak tiap aturan, lalu jalankan tes. Tujuanmu: izinkan trafik web, tolak yang berisiko.'
	],
	reactions: {
		web: 'Pas. Trafik web di port 443 memang untuk umum, jadi aturan ini layak diizinkan.',
		ssh: 'Hati-hati. SSH itu akses admin ke server. Dari alamat tak dikenal, lebih aman ditolak.',
		db: 'Itu bahaya. Database tidak boleh dibuka ke internet terbuka. Tolak koneksi ini.',
		secured: 'Bagus. Web dibuka, SSH dan database ditolak. Tolak semua dulu, buka hanya yang perlu. Itulah firewall yang aman.'
	},
	ruleHeader: 'Koneksi masuk',
	allow: 'Izinkan',
	deny: 'Tolak',
	testLabel: 'Jalankan tes',
	reset: 'Atur ulang',
	succeeded: 'Tersambung',
	failed: 'Diblokir',
	sourceLabel: 'Sumber',
	portLabel: 'Port',
	connections: {
		web: { name: 'Trafik web', source: 'internet (umum)' },
		ssh: { name: 'SSH (akses admin)', source: 'alamat tak dikenal' },
		db: { name: 'Database', source: 'internet terbuka' }
	}
};
