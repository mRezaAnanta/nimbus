import type { CostText } from '../types';

export const id: CostText = {
	title: 'Mengatur biaya',
	intro: [
		'Cloud itu seperti tagihan listrik. Kamu <b>bayar sesuai pakai</b>. Pakai lebih banyak, bayar lebih banyak. Matikan, berhenti membayar. Tidak ada biaya tetap untuk mesin yang menganggur di gudang.',
		'Karena itu, ada satu kebiasaan buruk yang mahal: membiarkan resource hidup padahal tidak terpakai, atau memesan mesin jauh lebih besar dari yang dibutuhkan. Meternya tetap jalan dan tagihan terus naik, walau tidak ada yang memakainya.',
		'Solusinya disebut <b>right sizing</b>, yaitu mencocokkan resource dengan kebutuhan nyata. Matikan yang nganggur, kecilkan yang kebesaran. Tapi hati-hati, terlalu kecil juga buruk: kalau mesin kewalahan, pengguna yang kena. Targetnya ukuran yang pas, bukan yang paling kecil.',
		'Lihat tagihan bulananmu di sebelah. Ada satu kotak yang nganggur dan satu yang kebesaran. Rapikan keduanya dan perhatikan tagihannya turun.'
	],
	reactions: {
		wasteful:
			'Lihat angkanya. Kotak nganggur itu sama sekali tidak melayani siapa pun, tapi tagihannya tetap penuh. Yang kebesaran juga, kapasitasnya jauh lebih besar dari yang dipakai. Itu uang yang terbuang tiap bulan.',
		rightsized:
			'Nah, jauh lebih ramping. Kamu mematikan yang nganggur dan mengecilkan yang kebesaran ke ukuran pas, jadi tetap kuat melayani pengguna tapi tagihannya turun banyak. Itulah right sizing.'
	},
	billLabel: 'Tagihan bulanan',
	perMonth: 'per bulan',
	idleLabel: 'Server uji coba',
	idleSub: 'Nganggur, tidak ada trafik',
	bigLabel: 'Server web',
	bigSub: 'Kebesaran untuk bebannya',
	rightLabel: 'Database',
	rightSub: 'Sudah pas',
	turnOff: 'Matikan',
	downsize: 'Kecilkan',
	usageLabel: 'Pemakaian {n} persen',
	tooSmall: 'Terlalu kecil, pengguna kewalahan',
	hint: 'Matikan yang nganggur, kecilkan yang kebesaran'
};
