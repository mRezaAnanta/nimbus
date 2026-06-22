import type { Chapter } from '../types';
import { container } from './container';
import { serverless } from './serverless';
import { monitoring } from './monitoring';
import { cost } from './cost';

export const compute: Chapter = {
	id: 'compute',
	number: 7,
	title: { id: 'Komputasi & Operasi', en: 'Compute & Operations' },
	lessons: [container, serverless, monitoring, cost],
	summary: {
		id: {
			title: 'Bab 7 selesai',
			sub: 'Kamu sudah paham cara menjalankan dan mengelola aplikasi:',
			items: [
				'Sebuah <b>container</b> adalah paket ringan dan portabel yang jalan sama persis di mana saja',
				'<b>Serverless</b> menjalankan fungsimu saat dipanggil dan turun ke nol saat sepi, jadi kamu bayar per panggilan',
				'Pantau lewat <b>metrik</b>, <b>dashboard</b>, dan <b>alarm</b>, supaya kamu tahu masalah sebelum pengunjung merasakannya',
				'Cloud itu <b>bayar sesuai pakai</b>, jadi <b>right sizing</b> menghemat uang, sementara resource nganggur membuang uang'
			],
			nextNote:
				'Berikutnya, <b>pilih provider</b>-mu. AWS, Google Cloud, atau Azure, jalur Bagian 2 yang sedang dibangun.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 7 complete',
			sub: 'You now know how to run and operate an app:',
			items: [
				'A <b>container</b> is a light, portable package that runs the same anywhere',
				'<b>Serverless</b> runs your function on demand and scales to zero when idle, so you pay per call',
				'Watch through <b>metrics</b>, <b>dashboards</b>, and <b>alarms</b>, so you know about trouble before visitors feel it',
				'The cloud is <b>pay as you go</b>, so <b>right sizing</b> saves money while idle resources waste it'
			],
			nextNote:
				'Next up, <b>pick your provider</b>. AWS, Google Cloud, or Azure, the Part 2 tracks now being built.',
			restart: 'Start over'
		}
	}
};
