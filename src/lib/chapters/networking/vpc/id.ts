import type { NetworkText } from '../types';

export const id: NetworkText = {
	title: 'Jaringan privat dan subnet',
	intro: [
		'Di cloud, kamu punya jaringan privat sendiri yang terpisah dari orang lain. Namanya <b>VPC</b>, Virtual Private Cloud. Anggap saja sebuah gedung yang khusus milikmu.',
		'Gedung itu dibagi jadi beberapa lantai, namanya <b>subnet</b>. Ada <b>subnet publik</b> yang bisa dijangkau dari internet, seperti lobi yang terbuka untuk tamu. Cocok untuk web server.',
		'Lalu ada <b>subnet privat</b> yang cuma bisa diakses dari dalam, seperti lantai khusus staf. Cocok untuk database, karena isinya tidak boleh dipegang sembarang orang.',
		'Coba atur sendiri. Taruh web server dan database di subnet yang menurutmu tepat, lalu tekan tes dari internet untuk lihat apa yang bisa dijangkau.'
	],
	reactions: {
		exposed: 'Hati-hati, database-mu ada di subnet publik, jadi siapa pun dari internet bisa menjangkaunya. Itu bocor. Pindahkan database ke subnet privat.',
		secured: 'Pas. Web server publik supaya pengunjung bisa membuka situsmu, database privat supaya tersembunyi dari internet. Cuma jalur internal yang bisa menyentuhnya.'
	},
	vpcLabel: 'VPC (jaringan privatmu)',
	publicLabel: 'Subnet publik',
	publicSub: 'lobi, terbuka dari internet',
	privateLabel: 'Subnet privat',
	privateSub: 'lantai staf, internal saja',
	webLabel: 'Web server',
	dbLabel: 'Database',
	placeWeb: 'Taruh web server di sini',
	placeDb: 'Taruh database di sini',
	testLabel: 'Tes dari internet',
	reachable: 'Bisa dijangkau',
	blocked: 'Terlindung',
	exposedNote: 'Database terbuka ke internet',
	securedNote: 'Setup aman',
	reset: 'Atur ulang'
};
