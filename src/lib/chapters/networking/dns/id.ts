import type { DnsText } from '../types';

export const id: DnsText = {
	title: 'IP dan DNS',
	intro: [
		'Setiap server di internet punya <b>alamat IP</b>, yaitu deretan angka yang menunjukkan lokasinya, mirip nomor rumah. Contohnya 93.184.216.34. Browser butuh angka ini untuk menyambung.',
		'Masalahnya, manusia susah menghafal angka. Jadi kita pakai nama yang gampang diingat seperti nimbus.com. Tapi komputer tetap butuh angkanya.',
		'Di sinilah <b>DNS</b> bekerja. DNS itu buku telepon internet: kamu kasih sebuah nama, dia balikin alamat IP-nya. Begitu IP ketemu, browser baru bisa menyambung ke server yang tepat.',
		'Coba sendiri. Pilih sebuah domain, lihat DNS mengubah namanya jadi IP, lalu browser menyambung ke alamat itu.'
	],
	reactions: {
		resolved: 'Nah, DNS tadi menerjemahkan nama itu jadi sebuah alamat IP. Sekarang browser sudah tahu ke angka mana harus menyambung.',
		connected: 'Mantap. Browser menyambung ke alamat IP itu dan halamannya kebuka. Itulah perjalanan dari nama ke IP ke koneksi.'
	},
	prompt: 'Pilih sebuah domain',
	resolveLabel: 'Cari IP (DNS)',
	connectLabel: 'Sambungkan browser',
	resolverTitle: 'Resolver DNS',
	resolving: 'Mencari',
	resolved: 'Ketemu',
	connecting: 'Menyambung',
	connected: 'Tersambung',
	ipLabel: 'Alamat IP',
	again: 'Coba domain lain',
	domains: {
		'nimbus.com': '93.184.216.34',
		'toko-kopi.id': '203.0.113.52',
		'kelas-awan.com': '198.51.100.27'
	}
};
