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
		chapter: 'Bab',
		welcome: [
			'Halo! Aku <b>Nim</b>, si awan pemandu. Aku bakal nemenin kamu belajar <b>cloud</b> dari benar-benar nol.',
			'Di sini kamu nggak cuma baca teori. Tiap konsep langsung kamu coba sendiri, dan aku jelaskan pelan-pelan sambil jalan.',
			'Pelan tapi padat: server, cloud, region, dan seterusnya. Yuk, kita mulai dari yang paling dasar.'
		]
	},
	en: {
		next: 'Next',
		back: 'Back',
		finish: 'Finish',
		start: 'Start',
		completeHint: 'Finish the step first',
		chapter: 'Chapter',
		welcome: [
			"Hi! I'm <b>Nim</b>, your cloud guide. I'll help you learn <b>cloud</b> from absolute zero.",
			"Here you don't just read theory. You try each concept yourself, and I explain it step by step as we go.",
			'Slow but compact: servers, cloud, regions, and beyond. Let me start with the basics.'
		]
	}
};

export const lang = writable<Lang>('id');
export const t = derived(lang, ($l) => ui[$l]);
export function setLang(l: Lang) {
	lang.set(l);
}
