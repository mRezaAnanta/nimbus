import type { FirewallText } from '../types';

export const id: FirewallText = {
	title: 'Firewall',
	intro: [
		'Pintu yang terbuka ke internet akan didatangi siapa saja, tamu baik maupun orang iseng. Harus ada yang menyeleksi di depan.',
		'<b>Firewall</b> itu satpamnya. Dia berdiri di depan server sambil memegang daftar tamu, dan memeriksa setiap orang yang datang sebelum boleh masuk.',
		'Aturannya dibuat olehmu, dan aturan paling aman dimulai dari <b>tolak semua</b>, lalu izinkan yang perlu saja. Misalnya, tamu yang mau membuka halaman web dipersilakan, selain itu ditolak.',
		'Coba sendiri. Datangkan tamu web, lalu datangkan orang iseng, dan lihat si satpam bekerja.'
	],
	reactions: {
		allow:
			'Tamu web ada di daftar, satpam membukakan pintu. Pengunjung situsmu tidak pernah merasa diperiksa, padahal selalu.',
		deny: 'Orang iseng tidak ada di daftar, langsung ditolak di depan pintu bahkan sebelum menyentuh server. Itulah firewall, menolak dulu, mengizinkan seperlunya.'
	},
	guardLabel: 'Firewall',
	guardSub: 'satpam di depan pintu',
	serverLabel: 'Server',
	rulesTitle: 'Daftar tamu',
	ruleAllow: 'Tamu web, persilakan',
	ruleDeny: 'Selain itu, tolak',
	guestWeb: 'Tamu web',
	guestBad: 'Orang iseng',
	sendWeb: 'Datangkan tamu web',
	sendBad: 'Datangkan orang iseng',
	allowedTag: 'masuk',
	deniedTag: 'ditolak',
	noteIdle: 'Satpam siaga dengan daftar tamunya',
	noteAllow: 'Ada di daftar, dipersilakan masuk',
	noteDeny: 'Tidak ada di daftar, berhenti di sini'
};
