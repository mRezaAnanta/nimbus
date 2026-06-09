import type { ScalingText } from '../types';

export const id: ScalingText = {
	title: 'Scaling: vertikal vs horizontal',
	intro: [
		'Trafikmu makin naik dan satu server biasa mulai keteteran. Ada dua cara menambah tenaga, dan keduanya beda gaya.',
		'Cara pertama: <b>scaling vertikal</b>. Kamu ganti server dengan mesin yang lebih besar, lebih banyak CPU dan RAM dalam satu kotak. Gampang dan tidak perlu ubah apa apa, tapi ada batas atasnya. Mesin terbesar pun ada ujungnya, harganya mahal, dan tetap satu titik yang kalau mati semua ikut mati.',
		'Cara kedua: <b>scaling horizontal</b>. Daripada satu kotak besar, kamu pakai banyak kotak identik berdampingan dan bagi bebannya. Bisa terus ditambah jauh lebih banyak, dan kalau satu mati yang lain tetap jalan. Syaratnya butuh load balancer di depan dan aplikasi yang tidak menyimpan data di satu mesin saja.',
		'Coba dua duanya. Klik Vertikal sampai kotaknya tidak bisa membesar lagi, lalu klik Horizontal untuk menambah kotak yang berbagi beban.'
	],
	reactions: {
		vertical:
			'Scaling vertikal: satu kotak yang sama tapi makin besar, CPU dan RAM-nya naik. Terus klik sampai dia mentok di batas atas.',
		ceiling:
			'Nah, mentok. Mesin sudah sebesar mungkin dan tidak bisa tumbuh lagi. Ini langit langitnya scaling vertikal, dan tetap satu titik yang rawan. Coba Horizontal.',
		horizontal:
			'Scaling horizontal: tambah kotak identik di sebelahnya, beban dibagi rata. Bisa terus ditambah, dan satu kotak mati pun yang lain tetap melayani.'
	},
	verticalBtn: 'Vertikal: perbesar',
	horizontalBtn: 'Horizontal: tambah kotak',
	reset: 'Ulangi',
	verticalLabel: 'Vertikal: satu mesin lebih besar',
	horizontalLabel: 'Horizontal: lebih banyak mesin',
	cpuLabel: 'CPU + RAM',
	maxedOut: 'Mentok',
	addNote: 'tambah mesin',
	workloadLabel: 'Beban kerja naik',
	tradeoffVertical: 'Simpel, tapi ada batas atas, mahal, dan satu titik rawan mati.',
	tradeoffHorizontal: 'Jauh lebih lentur dan tahan satu mesin mati, tapi butuh load balancer.'
};
