import type { IamText } from '../types';

export const id: IamText = {
	title: 'Identitas dan Akses',
	intro: [
		'Bayangkan kantor besar. Di pintu masuk, satpam ngecek kartu identitasmu untuk memastikan kamu memang kamu. Itu namanya <b>autentikasi</b>: membuktikan siapa dirimu, biasanya lewat password atau kode.',
		'Tapi kartu yang sama belum tentu buka semua pintu. Punyamu mungkin cuma bisa buka ruang kerjamu, bukan ruang server. Pintu mana yang boleh kamu buka itu namanya <b>otorisasi</b>: apa saja yang boleh kamu lakukan.',
		'Aturan emasnya: <b>least privilege</b>, kasih tiap identitas akses seperlunya saja. Kalau semua orang dikasih akses admin penuh, satu password bocor bisa bikin seluruh sistem jebol.',
		'Coba sendiri. Atur izin untuk user ini, lalu uji beberapa aksi. Yang diizinkan akan berhasil, sisanya ditolak.'
	],
	reactions: {
		denied: 'Nah, aksi itu ditolak karena kamu tidak memberi izinnya. User cuma bisa melakukan hal yang sudah kamu pilih. Itulah otorisasi yang bekerja.',
		allowed: 'Berhasil, karena izin ini memang kamu berikan. Sekarang coba aksi yang tidak kamu izinkan dan lihat bedanya.',
		leastpriv:
			'Mantap. Kamu memberi akses seperlunya saja, baca file tapi tidak boleh hapus database. Itulah least privilege. Kalau password user ini bocor, kerusakannya tetap terbatas.'
	},
	userLabel: 'Nadia',
	userSub: 'Anggota tim',
	badgeLabel: 'Kartu akses',
	adminLabel: 'Admin penuh',
	adminHint: 'Bisa apa saja (berisiko)',
	scopedLabel: 'Izin terbatas',
	scopedHint: 'Pilih sendiri tiap izin',
	permsTitle: 'Beri izin',
	tryTitle: 'Coba aksi',
	allowedTag: 'Diizinkan',
	deniedTag: 'Ditolak',
	resetLabel: 'Atur ulang',
	perms: {
		readFile: 'Baca file',
		writeFile: 'Ubah file',
		deleteDb: 'Hapus database',
		manageUsers: 'Kelola user'
	},
	actions: {
		readFile: 'Buka file laporan',
		writeFile: 'Simpan perubahan file',
		deleteDb: 'Hapus database',
		manageUsers: 'Tambah user baru'
	}
};
