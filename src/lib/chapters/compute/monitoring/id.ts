import type { MonitoringText } from '../types';

export const id: MonitoringText = {
	title: 'Memantau sistem',
	intro: [
		'Pikirkan dashboard mobil. Ada speedometer, suhu mesin, sisa bensin. Tanpa itu kamu menyetir buta dan baru sadar mesin overheat setelah ngebul.',
		'Server juga begitu. <b>Metrik</b> adalah angka kesehatannya, misalnya pemakaian CPU, jumlah trafik, dan jumlah error. <b>Dashboard</b> menampilkan semua angka itu dalam satu layar supaya kamu bisa melihat sekilas.',
		'Tapi kamu tidak mungkin menatap dashboard sepanjang hari. Di situ <b>alarm</b> masuk. Kamu pasang batas, misalnya CPU di atas 80 persen, dan begitu metrik melewati batas itu, alarm berbunyi dan memberi tahu kamu, jauh sebelum pengunjung merasakan situsnya lambat.',
		'Ayo coba. Gauge ini bergerak sesuai kondisi nyata server. Geser batas alarm CPU, lalu tunggu sebentar sampai CPU melonjak dan alarmnya berbunyi.'
	],
	reactions: {
		'alarm-set': 'Mantap, alarm sudah terpasang. Sekarang sistem yang mengawasi CPU untukmu. Tunggu sebentar, biasanya trafik naik dan CPU ikut melonjak.',
		'alarm-fired':
			'Itu dia. CPU melewati batasmu dan alarm langsung berbunyi. Kamu tahu duluan dan sempat bertindak, sebelum satu pun pengunjung merasakan masalahnya. Itulah gunanya memantau.'
	},
	cpuLabel: 'CPU',
	trafficLabel: 'Trafik',
	errorsLabel: 'Error',
	thresholdLabel: 'Batas alarm CPU: {n} persen',
	setAlarm: 'Pasang alarm',
	alarmArmed: 'Alarm aktif di {n} persen',
	alarmFiring: 'Alarm berbunyi',
	allCalm: 'Semua aman',
	siteUp: 'Sehat',
	siteWarn: 'Perlu perhatian',
	hint: 'Geser batasnya, lalu pasang alarm'
};
