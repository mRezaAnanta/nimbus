import type { AZText } from '../../types';

export const id: AZText = {
	title: 'Apa itu Availability Zone?',
	intro: [
		'Tadi kamu sudah pilih region yang paling dekat. Tapi satu region itu sebenarnya bukan satu gedung.',
		'Di dalam satu region ada beberapa data center terpisah, namanya <b>Availability Zone</b> (disingkat AZ). Letaknya berjauhan, dengan listrik dan jaringan masing-masing.',
		'Kenapa dipisah? Karena satu gedung bisa kena masalah, entah mati listrik, kebakaran, atau banjir. Kalau semua server-mu numpuk di satu AZ, satu musibah bikin website-mu mati total.',
		'Coba buktikan. Sekarang server-mu cuma ada di satu AZ. Picu sebuah gangguan, lalu lihat yang terjadi.'
	],
	reactions: {
		down: 'Nah kan. Karena cuma ada di satu AZ, pas AZ itu kena gangguan, website-mu langsung ikut mati. Sekarang sebar server-mu ke AZ lain, lalu picu lagi.',
		survived: 'Lihat bedanya. Satu AZ tumbang, tapi AZ lain tetap melayani, jadi website-mu selamat. Itulah gunanya sebar ke beberapa AZ.'
	},
	regionLabel: 'Region-mu',
	zonePrefix: 'Zona',
	serverLabel: 'Server',
	place: 'Klik zona untuk menaruh atau mengangkat server',
	trigger: 'Picu gangguan',
	outage: 'Gangguan',
	statusUp: 'Online',
	statusDown: 'Mati',
	activeZones: 'Zona aktif'
};
