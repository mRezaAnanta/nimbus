import type { DatabaseText } from '../types';

export const id: DatabaseText = {
	title: 'SQL atau NoSQL?',
	intro: [
		'Data yang sering dipakai biasanya tinggal di sebuah database. Ada dua keluarga besar, dan keduanya menyimpan data dengan cara yang sangat berbeda.',
		'<b>SQL</b> menata data dalam tabel berisi baris dan kolom. Aturannya ketat, semua baris wajib mengikuti kolom yang sama, dan antar tabel bisa saling terhubung. Ketatnya itulah yang bikin dia bisa menjamin transaksi selalu konsisten.',
		'<b>NoSQL</b> menyimpan dokumen yang bentuknya bebas. Satu dokumen boleh punya isian yang beda dari tetangganya, dan koleksinya gampang melar ke banyak mesin saat datanya membludak.',
		'Coba tambah isi di keduanya. Rasakan bedanya tabel yang ketat dan dokumen yang lentur, lalu lihat kapan masing masing dipakai.'
	],
	reactions: {
		sql: 'Lihat, baris baru wajib ngikut kolom yang sudah ada, id, nama, saldo, tidak boleh kurang atau nambah sendiri. Ketat begini yang bikin uang tidak pernah hilang di tengah jalan.',
		nosql:
			'Lihat, dokumen baru bentuknya beda sendiri pun tetap diterima. Kebebasan ini yang bikin NoSQL enak buat data yang beraneka ragam dan gampang dilebarkan ke banyak mesin.'
	},
	sqlTitle: 'SQL',
	sqlSub: 'tabel ketat yang saling terhubung',
	nosqlTitle: 'NoSQL',
	nosqlSub: 'dokumen bebas yang gampang melar',
	tableName: 'akun',
	columns: ['id', 'nama', 'saldo'],
	rows: [
		['1', 'Adi', '120000'],
		['2', 'Bima', '85000']
	],
	extraRows: [
		['3', 'Sari', '40000'],
		['4', 'Tono', '67000']
	],
	addRow: 'Tambah baris',
	schemaNote: 'baris baru wajib ikut kolom yang sama',
	docs: [
		{ name: 'post_1', fields: ['penulis', 'teks', 'suka'] },
		{ name: 'post_2', fields: ['penulis', 'video', 'durasi'] },
		{ name: 'post_3', fields: ['penulis', 'polling', 'pilihan', 'batas'] }
	],
	addDoc: 'Tambah dokumen',
	freeNote: 'tiap dokumen boleh beda bentuk',
	whenTitle: 'Kapan dipakai',
	sqlWhen: ['Uang & transaksi', 'Toko online', 'Data yang saling terkait'],
	nosqlWhen: ['Feed media sosial', 'Katalog beraneka bentuk', 'Data super besar'],
	done: 'Kamu sudah merasakan keduanya'
};
