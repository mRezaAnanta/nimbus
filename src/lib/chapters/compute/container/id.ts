import type { ContainerText } from '../types';

export const id: ContainerText = {
	title: 'Apa itu container?',
	intro: [
		'Sebuah aplikasi butuh banyak hal pendukung biar jalan: bahasa pemrograman, library, file pengaturan. Pindah ke komputer lain, satu hal kelupaan, langsung error. Klasik: "di laptopku jalan kok".',
		'Solusinya, bungkus aplikasi bersama semua kebutuhannya jadi satu paket rapi. Paket itu namanya <b>container</b>. Begitu jadi, dia jalan sama persis di mana saja.',
		'Mirip peti kemas standar di pelabuhan. Isinya apa saja, tapi ukuran luarnya seragam. Mau diangkat ke kapal mana pun atau truk mana pun, langsung pas. Container jauh lebih ringan dan cepat menyala daripada VM, karena dia ikut menumpang sistem operasi server, bukan mem-boot OS utuh sendiri.',
		'Coba sendiri. Build aplikasimu jadi satu image, lalu jalankan salinan yang sama persis di server berbeda.'
	],
	reactions: {
		shipped: 'Nah, sekali di-build, aplikasimu jadi satu image yang siap diangkut. Sekarang jalankan image yang sama di server lain.',
		scaled: 'Lihat, image yang sama persis jalan di dua server tanpa diubah sedikit pun. Itulah kekuatan container: bungkus sekali, jalan di mana saja, dan langsung nyala.'
	},
	buildLabel: 'Build image',
	buildHint: 'Bungkus aplikasi plus kebutuhannya jadi satu image',
	imageLabel: 'Image siap',
	runHere: 'Jalankan di sini',
	hostLabel: 'Server {n}',
	vmTitle: 'Virtual machine',
	vmSub: 'tiap salinan boot OS utuh dulu',
	vmSize: 'Berat (GB)',
	vmBoot: 'Boot lambat',
	containerTitle: 'Container',
	containerSub: 'menumpang OS server, nyala instan',
	containerSize: 'Ringan (MB)',
	containerBoot: 'Nyala instan',
	bootingOs: 'Mem-boot OS...',
	appLabel: 'Aplikasi',
	depsLabel: 'Kebutuhan',
	runningHere: 'Jalan di sini'
};
