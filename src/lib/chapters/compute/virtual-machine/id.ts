import type { VirtualMachineText } from '../types';

export const id: VirtualMachineText = {
	title: 'Apa itu virtual machine?',
	intro: [
		'Satu server fisik itu mesin yang besar dan kuat. Sayang kalau cuma dipakai buat satu hal kecil, banyak tenaganya menganggur.',
		'Triknya, satu server itu dibelah jadi beberapa komputer virtual yang terpisah. Tiap potongan namanya <b>virtual machine</b> (VM). Tiap VM punya sistem operasi sendiri dan merasa seperti komputer utuh, padahal semuanya berbagi satu hardware yang sama.',
		'Bayangkan satu gedung apartemen. Satu bangunan, tapi isinya banyak unit terpisah. Tiap penghuni punya pintu, dapur, dan kamar sendiri, tanpa mengganggu tetangga.',
		'Coba sendiri. Server ini punya jatah CPU dan RAM. Buat beberapa VM dan bagi sumber dayanya. Hati-hati, jangan sampai kamu membagi lebih dari yang tersedia.'
	],
	reactions: {
		created: 'Mantap, satu VM jalan dengan jatah sumber dayanya sendiri. Coba buat satu lagi yang masih muat di sisa kapasitas.',
		overcommit: 'Nah, itu masalahnya. Kamu janjikan lebih dari yang dipunya server, jadi VM-VM rebutan sumber daya dan melambat. Kurangi jatahnya biar semuanya muat.'
	},
	hostLabel: 'Server fisik',
	hostSub: 'satu hardware, dibagi bersama',
	cpuLabel: 'CPU',
	ramLabel: 'RAM',
	freeLabel: 'Sisa',
	usedLabel: 'Terpakai',
	addVm: 'Buat VM',
	vmName: 'VM {n}',
	osLabel: 'OS sendiri',
	runningLabel: 'Jalan',
	slowLabel: 'Melambat',
	overHint: 'Sumber daya berlebih, VM rebutan',
	fitHint: 'Geser slider untuk membagi CPU dan RAM ke tiap VM'
};
