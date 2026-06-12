import type { NetworkText } from '../types';

export const id: NetworkText = {
	title: 'Jaringan privat dan subnet',
	intro: [
		'Server servermu di cloud tinggal di sebuah <b>VPC</b>, jaringan privat milikmu sendiri. Bayangkan sebuah rumah dengan pagar, kamu yang menentukan ruangan dan pintunya.',
		'Di dalamnya, ruangan ruangan itu namanya <b>subnet</b>. Yang menghadap jalan disebut <b>subnet publik</b>, pintunya terbuka ke internet, di sinilah web server menyambut pengunjung.',
		'Yang di belakang disebut <b>subnet privat</b>, tidak punya pintu ke jalan sama sekali. Database ditaruh di sini, cuma boleh diajak bicara oleh web server dari dalam.',
		'Lihat sendiri. Kirim pengunjung ke situsmu, lalu coba todong database-nya langsung dari internet.'
	],
	reactions: {
		web: 'Pengunjung masuk lewat pintu depan, dilayani web server di subnet publik, dan web server-lah yang mengambilkan data ke database di belakang. Tamu tidak pernah menyentuh database.',
		blocked:
			'Ditolak mentah mentah. Subnet privat tidak punya pintu ke internet, jadi orang iseng tidak bisa menyentuh database-mu walau tahu alamatnya. Itulah gunanya memisahkan ruangan.'
	},
	vpcLabel: 'VPC',
	vpcSub: 'jaringan privatmu',
	internetLabel: 'Internet',
	publicLabel: 'Subnet publik',
	publicSub: 'pintunya ke internet',
	privateLabel: 'Subnet privat',
	privateSub: 'tanpa pintu keluar',
	webLabel: 'Web server',
	dbLabel: 'Database',
	visitSite: 'Kunjungi situs',
	attackDb: 'Todong database dari luar',
	noteIdle: 'Dua ruangan, cuma satu yang punya pintu',
	noteWeb: 'Tamu dilayani di depan, data diambilkan dari belakang',
	noteBlocked: 'Tidak ada pintu, tidak ada jalan masuk'
};
