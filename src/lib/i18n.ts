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
		welcome: [
			'Halo! Aku <b>Nim</b>. Mulai sekarang aku yang nemenin kamu belajar <b>cloud</b> dari nol banget, jadi santai aja ya.',
			'Di sini kamu nggak cuma baca teori. Tiap konsep langsung kamu coba sendiri, dan aku akan jelaskan pelan-pelan sambil kita jalan.',
			'Kita nggak buru-buru, tapi juga nggak bertele-tele. Kita bahas server dulu, lalu cloud, region, dan seterusnya. Yuk, mulai dari yang paling dasar.'
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
		welcome: [
			"Hi! I'm <b>Nim</b>. From here on I'll keep you company while you learn <b>cloud</b> from the very start, so take it easy.",
			"Here you don't just read theory. You try each concept yourself, and I'll explain everything slowly as we go.",
			"We won't rush, but we won't pad it out either. We'll cover servers first, then cloud, regions, and onward. Let's begin with the basics."
		]
	}
};

export const lang = writable<Lang>('id');
export const t = derived(lang, ($l) => ui[$l]);
export function setLang(l: Lang) {
	lang.set(l);
}
