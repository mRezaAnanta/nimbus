import type { SharedResponsibilityText } from '../types';

export const id: SharedResponsibilityText = {
	title: 'Tanggung Jawab Bersama',
	intro: [
		'Pakai cloud bukan berarti keamanan sepenuhnya urusan provider. Ada pembagian yang jelas, namanya <b>shared responsibility model</b>, model tanggung jawab bersama.',
		'Provider mengamankan <b>cloud itu sendiri</b>: gedung data center fisik, perangkat keras, lapisan virtualisasi (hypervisor), dan jaringan global. Bagian ini di luar jangkauanmu dan memang bukan tugasmu.',
		'Kamu mengamankan <b>apa yang kamu taruh di cloud</b>: datamu, siapa saja yang punya akses, konfigurasimu, dan password-mu. Faktanya, kebanyakan kebocoran datang dari sisi pelanggan, bukan provider, sering karena konfigurasi yang asal atau password lemah.',
		'Coba sendiri. Pilah tiap item ke kotak yang benar: Provider atau Kamu.'
	],
	reactions: {
		correct: 'Tepat. Kamu paham siapa yang pegang bagian itu.',
		wrong: 'Hmm, coba pikir lagi. Tanya dirimu: ini bagian dari cloud itu sendiri (urusan provider) atau sesuatu yang kamu taruh di atasnya (urusanmu)?'
	},
	providerLabel: 'Provider',
	providerSub: 'Mengamankan cloud-nya',
	youLabel: 'Kamu',
	youSub: 'Mengamankan isimu',
	prompt: 'Pilih satu item, lalu ketuk kotak yang menurutmu bertanggung jawab',
	done: 'Semua benar. Beginilah tanggung jawab dibagi.',
	items: {
		datacenter: 'Keamanan fisik data center',
		hardware: 'Perangkat keras server',
		hypervisor: 'Hypervisor',
		network: 'Jaringan global',
		iam: 'Izin akses (IAM)',
		passwords: 'Password-mu',
		appPatch: 'Patch aplikasimu',
		dataConfig: 'Konfigurasi datamu'
	}
};
