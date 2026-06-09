import type { Chapter } from '../types';
import { monitoring } from './monitoring';
import { cost } from './cost';

export const operations: Chapter = {
	id: 'operations',
	number: 8,
	title: { id: 'Operasi', en: 'Operations' },
	lessons: [monitoring, cost],
	summary: {
		id: {
			title: 'Bab 8 selesai',
			sub: 'Kamu sudah paham cara menjaga sistem tetap sehat dan hemat:',
			items: [
				'Kamu tidak bisa memperbaiki yang tidak kamu lihat, jadi pantau lewat <b>metrik</b>, <b>dashboard</b>, dan <b>alarm</b>',
				'Alarm memberi tahu kamu sebelum pengguna merasakan masalahnya',
				'Cloud itu <b>bayar sesuai pakai</b>, jadi <b>right sizing</b> (pas dengan kebutuhan nyata) menghemat uang, sementara resource nganggur atau kebesaran membuang uang'
			],
			nextNote:
				'Sampai sini kamu sudah paham semua konsep intinya. Berikutnya: <b>Proyek Akhir</b>, kita rangkai semuanya jadi satu sistem nyata lalu kita uji.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 8 complete',
			sub: 'You now know how to keep a system healthy and lean:',
			items: [
				'You cannot fix what you cannot see, so watch it through <b>metrics</b>, <b>dashboards</b>, and <b>alarms</b>',
				'Alarms warn you before your users ever feel the problem',
				'The cloud is <b>pay as you go</b>, so <b>right sizing</b> (matching real need) saves money, while idle or oversized resources waste it'
			],
			nextNote:
				'That covers every core concept. Next up: the <b>Final Project</b>, where we assemble all of it into one real system and put it to the test.',
			restart: 'Start over'
		}
	}
};
