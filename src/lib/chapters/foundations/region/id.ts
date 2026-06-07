import type { RegionText } from '../../types';

export const id: RegionText = {
	title: 'Apa itu Region?',
	intro: [
		'Anggap kamu punya banyak pengguna di <b>Argentina</b>. Server-mu harus ditaruh di salah satu lokasi data center milik penyedia cloud. Mulai sekarang kita pakai <b>AWS</b> (Amazon Web Services) sebagai contoh, salah satu penyedia cloud terbesar.',
		'Masalahnya, Argentina belum punya data center sendiri. Tapi tetap ada satu di benua yang sama, dan pilihan lokasi inilah yang menentukan secepat apa website terasa di sisi pengguna.',
		'Tapi kenapa jarak bisa ngaruh ke kecepatan? Kuncinya ada di <b>latensi</b>. Coba inget waktu main game online, kamu biasanya disuruh pilih server dulu, Asia, Amerika, atau Eropa. Makin jauh servernya, makin lama data bolak-balik, dan game (atau website) jadi terasa lemot.',
		'Nah, waktu bolak-balik data antara penggunamu dan server itulah yang disebut <b>latensi</b>. Satuannya milidetik (ms), dan makin kecil angkanya makin cepat.',
		'Sekarang giliranmu. Coba taruh server-mu di beberapa kota, lalu lihat <b>latensinya</b>. Makin dekat ke Argentina, harusnya makin kecil.'
	],
	reactions: {
		near: 'Nah, <b>São Paulo</b> memang bukan di Argentina, tapi masih satu benua, jadi latensinya paling kecil di antara pilihan.',
		mid: 'Lumayan jauh, latensinya naik. Masih ada region yang lebih dekat ke penggunamu.',
		far: 'Jauh banget. Datanya harus menyeberang <b>separuh dunia</b>, jadi lemot. Itulah kenapa memilih region terdekat itu penting.'
	},
	users: 'Penggunamu',
	readoutPrompt: 'Pilih sebuah kota untuk mengukur kecepatannya',
	drag: 'Tarik untuk memutar bumi',
	flatLabel: 'Peta',
	globeLabel: 'Globe',
	ms: 'ms',
	verdicts: { instant: 'Instan', fast: 'Cepat', ok: 'Lumayan', slow: 'Agak lambat', laggy: 'Lemot' },
	cities: { jkt: 'Jakarta', sg: 'Singapura', tyo: 'Tokyo', fra: 'Frankfurt', iad: 'Virginia, AS', sao: 'São Paulo' }
};
