import { writable, derived } from 'svelte/store';

export type Lang = 'id' | 'en';

/** Global UI words only. Lesson/chapter text lives with each chapter in src/lib/chapters/. */
const ui = {
	id: {
		next: 'Lanjut',
		back: 'Kembali',
		finish: 'Selesai',
		start: 'Mulai',
		completeHint: 'Selesaikan dulu langkahnya',
		hideNim: 'Sembunyikan Nim',
		showNim: 'Tampilkan Nim',
		chapter: 'Bab',
		lessons: 'Pelajaran',
		locked: 'Selesaikan pelajaran sebelumnya dulu',
		welcomeMobile:
			'Oh iya, satu hal kecil. Kamu lagi pakai HP ya? Ini bakal jauh lebih enak di layar gede, laptop atau komputer, bahkan TV juga boleh sekalian ngajak sekeluarga nonton kamu belajar cloud haha. Tapi tenang, di HP tetap jalan kok.',
		welcome: [
			'Halo! Aku <b>Nim</b>. Mulai sekarang aku yang nemenin kamu belajar <b>cloud</b> dari nol banget, jadi santai aja ya.',
			'Di sini kamu nggak cuma baca teori. Tiap konsep langsung kamu coba sendiri, dan aku akan jelaskan pelan-pelan sambil kita jalan.',
			'Kita mulai dari yang paling dasar, yaitu <b>apa itu client dan server</b>, lalu pelan-pelan naik ke cloud, region, dan seterusnya. Yuk, kita mulai!'
		]
	},
	en: {
		next: 'Next',
		back: 'Back',
		finish: 'Finish',
		start: 'Start',
		completeHint: 'Finish the step first',
		hideNim: 'Hide Nim',
		showNim: 'Show Nim',
		chapter: 'Chapter',
		lessons: 'Lessons',
		locked: 'Finish the earlier lessons first',
		welcomeMobile:
			'Oh, one small thing. You are on a phone, right? This feels so much better on a big screen, a laptop or a computer, even a TV if you fancy, so the whole family can watch you learn cloud haha. No worries though, it runs fine on a phone too.',
		welcome: [
			"Hi! I'm <b>Nim</b>. From here on I'll keep you company while you learn <b>cloud</b> from the very start, so take it easy.",
			"Here you don't just read theory. You try each concept yourself, and I'll explain everything slowly as we go.",
			"We start from the very basics, <b>what a client and a server are</b>, then work our way up to the cloud, regions, and beyond. Let's get going!"
		]
	}
};

export const lang = writable<Lang>('id');
export const t = derived(lang, ($l) => ui[$l]);
export function setLang(l: Lang) {
	lang.set(l);
}
