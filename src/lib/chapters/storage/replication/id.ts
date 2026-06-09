import type { ReplicationText } from '../types';

export const id: ReplicationText = {
	title: 'Replikasi dan cadangan',
	intro: [
		'Data berharga butuh perlindungan. Kalau cuma ada satu salinan dan tempatnya hancur, data itu hilang selamanya.',
		'<b>Replikasi</b> berarti menjaga salinan hidup di tempat lain. Kalau satu salinan mati, replikanya bisa langsung mengambil alih. Ini melindungi dari kerusakan perangkat keras.',
		'<b>Cadangan</b> berbeda: ia adalah potret data pada satu titik waktu yang bisa kamu pulihkan. Ini melindungi dari kesalahan menghapus atau data rusak, yang justru akan ditiru begitu saja oleh replika hidup.',
		'Bayangkan fotokopi yang disimpan di gedung gedung berbeda. Sekarang coba sendiri: tambahkan replika di zona lain, ambil cadangan, lalu jatuhkan gangguan dan lihat datamu selamat.'
	],
	reactions: {
		lost: 'Aduh, cuma ada satu salinan, jadi begitu zonanya tumbang datamu hilang. Tambahkan replika di zona lain, atau ambil cadangan dulu sebelum mencoba lagi.',
		replicated: 'Lihat, gangguan cuma mengenai satu salinan, dan replika di zona lain langsung lanjut melayani. Datamu selamat lewat replikasi.',
		restored: 'Mantap. Penghapusan akan ditiru oleh replika hidup, tapi cadangan menyimpan potret lama, jadi datamu bisa dipulihkan utuh.'
	},
	primaryLabel: 'Utama',
	replicaLabel: 'Replika',
	serving: 'Melayani',
	standbyState: 'Siaga',
	lostLabel: 'Hilang',
	emptyLabel: 'kosong',
	addReplica: '+ Replika',
	takeBackup: 'Ambil cadangan',
	failButton: 'Jatuhkan gangguan',
	deleteButton: 'Hapus tak sengaja',
	restoreButton: 'Pulihkan dari cadangan',
	backupLabel: 'Cadangan',
	zones: { a: 'Zona A', b: 'Zona B', c: 'Zona C' },
	prompt: 'Tambahkan replika di zona lain, ambil cadangan, lalu uji dengan gangguan atau penghapusan.',
	done: 'Datamu selamat dari gangguan.'
};
