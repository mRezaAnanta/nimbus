import type { DatabaseText } from '../types';

export const id: DatabaseText = {
	title: 'SQL atau NoSQL?',
	intro: [
		'Data yang sering dipakai biasanya tinggal di sebuah database. Ada dua keluarga besar, dan keduanya menyimpan data dengan cara yang berbeda.',
		'<b>SQL</b> bersifat relasional: data ditata rapi dalam tabel berisi baris dan kolom, dengan skema yang ketat dan hubungan antar tabel. Kuat untuk transaksi yang harus selalu konsisten, seperti transfer bank.',
		'<b>NoSQL</b> menyimpan dokumen atau pasangan kunci nilai: bentuknya bebas dan mudah berkembang ke banyak mesin. Kuat untuk data yang sangat besar, sederhana, dan beragam, seperti feed media sosial.',
		'Lihat tabel rapi di kiri dan dokumen lentur di kanan. Sekarang tiap kebutuhan muncul, pilih mana yang paling pas.'
	],
	reactions: {
		sql: 'Tepat. Transaksi yang wajib konsisten butuh skema ketat dan jaminan SQL.',
		nosql: 'Tepat. Data yang besar, beragam, dan harus melar lebar memang ranah NoSQL.',
		wrong: 'Hmm, belum pas. Tanya dirimu: apakah ini butuh konsistensi ketat, atau butuh melar dengan bentuk yang bebas?'
	},
	sqlTitle: 'SQL (relasional)',
	sqlSub: 'Tabel, skema ketat, hubungan, kuat untuk transaksi',
	nosqlTitle: 'NoSQL (dokumen)',
	nosqlSub: 'Bentuk bebas, melar ke banyak mesin, kuat untuk skala besar',
	pickSql: 'SQL',
	pickNosql: 'NoSQL',
	prompt: 'Pilih yang paling pas untuk kebutuhan ini.',
	done: 'Selesai, kamu paham bedanya.',
	tableName: 'akun',
	columns: ['id', 'nama', 'saldo'],
	rows: [
		['1', 'Adi', '120000'],
		['2', 'Bima', '85000']
	],
	docLabel: 'post.json',
	cases: {
		transfer: 'Transfer bank yang harus selalu konsisten: uang tidak boleh hilang atau dobel saat berpindah antar akun.',
		feed: 'Feed media sosial berisi jutaan postingan yang bentuknya sangat beragam, dan harus tetap cepat saat dibanjiri pengguna.'
	},
	why: {
		sql: 'Transfer butuh skema ketat dan jaminan transaksi agar saldo selalu benar. Itu kekuatan SQL.',
		nosql: 'Feed yang besar dan beragam paling enak disimpan sebagai dokumen lentur yang melar lebar. Itu kekuatan NoSQL.',
		wrong: 'Belum pas untuk kebutuhan ini. Coba pilih lagi.'
	}
};
