import type { EncryptionText } from '../types';

export const id: EncryptionText = {
	title: 'Enkripsi',
	intro: [
		'Setiap pesan yang kamu kirim lewat internet melewati banyak jaringan dan komputer sebelum sampai. Di sepanjang jalan itu, ada saja yang bisa diam diam mengintip.',
		'<b>Enkripsi</b> mengacak datamu jadi kode yang tidak terbaca. Hanya yang punya <b>kunci</b> yang bisa membukanya kembali. Bagi pengintip, isinya cuma huruf acak tanpa arti.',
		'Datamu perlu dilindungi di dua tempat: saat <b>berjalan</b> di jaringan (inilah gunanya HTTPS, si gembok kecil di address bar) dan saat <b>disimpan</b> di disk (supaya kalau filenya dicuri, isinya tetap aman).',
		'Coba sendiri. Kirim pesan ini dengan enkripsi mati dulu, lihat reaksi si pengintip. Lalu nyalakan enkripsi dan kirim lagi.'
	],
	reactions: {
		plain: 'Aduh. Tanpa enkripsi, pesanmu lewat dalam bentuk teks polos, dan si pengintip langsung membacanya jelas jelas. Sekarang nyalakan enkripsi dan kirim lagi.',
		encrypted:
			'Nah, begini seharusnya. Pesanmu kini jadi kode acak, jadi si pengintip cuma lihat huruf ngawur. Hanya penerima yang punya kunci yang bisa membacanya.'
	},
	youLabel: 'Kamu',
	recipientLabel: 'Penerima',
	eavesdropperLabel: 'Pengintip',
	messageLabel: 'Pesanmu',
	encryptOff: 'Enkripsi mati',
	encryptOn: 'Enkripsi nyala',
	sendLabel: 'Kirim pesan',
	plainTag: 'Teks polos, bisa dibaca',
	scrambledTag: 'Teracak, aman',
	keyLabel: 'Punya kunci',
	noKeyLabel: 'Tanpa kunci',
	inTransitNote: 'Saat berjalan: HTTPS',
	atRestNote: 'Saat disimpan: terenkripsi di disk',
	sample: 'Saldo rekening: 50 juta'
};
