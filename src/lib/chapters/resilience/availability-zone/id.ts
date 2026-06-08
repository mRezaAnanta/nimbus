import type { AZText } from '../../types';

export const id: AZText = {
	title: 'Apa itu Availability Zone?',
	intro: [
		'Ini bukan teori. Tahun 2026 drone benar-benar menghantam data center AWS di Uni Emirat Arab dan Bahrain, dan banyak layanan di sana mati.',
		'Artinya data center bisa kena masalah nyata, bukan cuma mati listrik, tapi juga bencana bahkan serangan. Pertanyaannya, gimana caranya website tetap jalan walau satu gedung tumbang?',
		'Jawabannya, satu <b>region</b> itu bukan satu gedung. Di dalamnya ada beberapa data center terpisah, namanya <b>Availability Zone</b> (AZ), letaknya berjauhan dengan listrik dan jaringan sendiri-sendiri.',
		'Coba sendiri. Klik sebuah region untuk masuk ke dalamnya, sebar server-mu ke beberapa AZ, lalu picu gangguan.'
	],
	reactions: {
		virginia:
			'Perhatikan nama AZ-nya, <b>us-east-1a</b>, <b>us-east-1b</b>, dan seterusnya, selalu diakhiri huruf. Uniknya, huruf itu diacak beda-beda untuk tiap akun dan dirahasiakan, supaya tidak semua orang menumpuk di "a" dan beban tersebar rata. Begini juga di semua region. Sekarang sebar server-mu ke beberapa AZ, lalu picu gangguan.',
		singapore:
			'Perhatikan nama AZ-nya, <b>ap-southeast-1a</b>, <b>ap-southeast-1b</b>, dan seterusnya, selalu diakhiri huruf. Uniknya, huruf itu diacak beda-beda untuk tiap akun dan dirahasiakan, supaya tidak semua orang menumpuk di "a" dan beban tersebar rata. Begini juga di semua region. Sekarang sebar server-mu ke beberapa AZ, lalu picu gangguan.',
		down: 'Nah kan. Server-mu cuma ada di satu AZ, jadi pas AZ itu kena, website-mu langsung ikut mati. Sebar ke AZ lain, lalu picu lagi.',
		survived: 'Lihat bedanya. Satu AZ tumbang, tapi AZ lain tetap melayani, jadi website-mu selamat. Itulah gunanya sebar ke beberapa AZ.'
	},
	worldHint: 'Klik sebuah region untuk melihat Availability Zone-nya',
	back: 'Kembali ke peta',
	serverLabel: 'Server',
	place: 'Klik AZ untuk menaruh atau mengangkat server',
	trigger: 'Picu gangguan',
	statusUp: 'Online',
	statusDown: 'Mati',
	activeZones: 'AZ aktif',
	regions: { virginia: 'Virginia', singapore: 'Singapura' }
};
