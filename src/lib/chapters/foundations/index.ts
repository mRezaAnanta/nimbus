import type { Chapter } from '../types';
import { server } from './server';
import { cloud } from './cloud';
import { region } from './region';
import { cable } from './cable';

export const foundations: Chapter = {
	id: 'foundations',
	number: 1,
	title: { id: 'Fondasi', en: 'Foundations' },
	lessons: [server, cloud, region, cable],
	summary: {
		id: {
			title: 'Bab 1 selesai',
			sub: 'Kamu sudah paham fondasinya:',
			items: [
				'<b>Server</b> adalah komputer yang melayani website ke pengunjung',
				'<b>Cloud</b> berarti menyewa komputer di data center dan bayar sesuai pakai',
				'<b>Region</b> adalah memilih lokasi data center terdekat supaya cepat',
				'Data jalan lewat <b>kabel serat optik di dasar laut</b>, bukan satelit'
			],
			nextNote:
				'Berikutnya: <b>Availability Zone</b>. Kita bahas kenapa satu kota saja belum cukup, dan apa arti “badai” dalam dunia nyata (pemadaman data center).',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 1 complete',
			sub: 'You now understand the foundations:',
			items: [
				'<b>Server</b> is a computer that serves websites to visitors',
				'<b>Cloud</b> means renting computers in a data center and paying as you go',
				'<b>Region</b> is choosing the nearest data center location for speed',
				'Data travels through <b>fiber optic cables on the seabed</b>, not satellites'
			],
			nextNote:
				'Next up: <b>Availability Zone</b>. We will see why a single city is not enough, and what a “storm” really means (a data center outage).',
			restart: 'Start over'
		}
	}
};
