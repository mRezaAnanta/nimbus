import type { CloudText } from '../../types';

export const id: CloudText = {
	title: 'Apa itu cloud?',
	intro: [
		'Laptopmu gugur jadi server publik, dan tunneling cuma pintu pinjaman. Situs beneran butuh rumah yang serius. Ada dua cara, yaitu kelola sendiri (disebut <b>on-premise</b>) atau sewa di <b>cloud</b>.',
		'Banyak orang ngira cloud itu sesuatu yang ajaib di langit. Padahal cloud ya... <b>server biasa juga</b>. Bedanya, dia bukan di rumahmu, melainkan di gedung <i>data center</i> milik perusahaan besar, dan kamu tinggal sewa tanpa pernah melihat mesinnya.',
		'Biar kerasa bedanya, coba klik kedua pilihan di atas, server di rumahmu dan server di cloud.'
	],
	reactions: {
		home: 'Simpan sendiri di rumah atau kantor itu <b>on-premise</b>. Lihat di atas, pas mati lampu, website-mu langsung ikut mati.',
		cloud: 'Kamu pilih <b>cloud</b>. Server-nya nyala 24 jam di data center, jadi jarang mati. Sekarang bandingkan dengan <b>on-premise</b>.',
		both: 'Kelihatan kan bedanya? <b>On-premise</b> berisiko mati sendiri, sedangkan <b>cloud</b> jauh lebih stabil dan bayar sesuai pakai.'
	},
	homeTitle: 'Server di rumahmu',
	homeSub: 'On-premise (kelola sendiri)',
	cloudTitle: 'Server di cloud',
	cloudSub: 'Cloud (sewa data center)',
	homePoints: [
		'Kalau mati lampu, server ikut mati dan website-mu hilang',
		'Internet rumah tidak sekencang data center',
		'Komputernya panas, berisik, dan mahal dibeli'
	],
	cloudPoints: [
		'Listrik dan internet punya cadangan 24 jam, jadi jarang mati',
		'Sewa per jam, bayar hanya yang kamu pakai',
		'Butuh lebih kuat? Tambah komputer dalam hitungan detik'
	],
	onpremTerm: 'On-premise',
	cloudTerm: 'Cloud',
	offline: 'Mati lampu'
};
