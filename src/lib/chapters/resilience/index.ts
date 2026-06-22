import type { Chapter } from '../types';
import { availabilityZone } from './availability-zone';
import { failover } from './failover';
import { storageTypes } from './storage-types';
import { database } from './database';

export const resilience: Chapter = {
	id: 'resilience',
	number: 3,
	title: { id: 'Ketahanan & Data', en: 'Resilience & Data' },
	lessons: [availabilityZone, failover, storageTypes, database],
	summary: {
		id: {
			title: 'Bab 3 selesai',
			sub: 'Kamu sudah paham cara bertahan dan menjaga data:',
			items: [
				'Satu <b>region</b> berisi beberapa <b>Availability Zone</b>, yaitu data center yang terpisah',
				'Sebar server ke <b>beberapa AZ</b>, dan siapkan cadangan yang bisa mengambil alih saat region utama tumbang (<b>failover</b>)',
				'<b>Object</b> untuk file utuh, <b>block</b> untuk disk satu mesin, <b>file</b> untuk folder bersama',
				'<b>SQL</b> kuat untuk transaksi yang konsisten, <b>NoSQL</b> kuat untuk data besar dan beragam'
			],
			nextNote:
				'Berikutnya: <b>Aliran Data</b>. Kita lihat data masuk dan keluar server (ingress dan egress), dan kenapa trafik ramai bisa macet di satu titik (bottleneck).',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 3 complete',
			sub: 'You now know how to survive failures and keep data safe:',
			items: [
				'One <b>region</b> holds several <b>Availability Zones</b>, which are separate data centers',
				'Spread servers across <b>multiple AZs</b>, and keep a standby that can take over when the primary falls (<b>failover</b>)',
				'<b>Object</b> for whole files, <b>block</b> for a single machine disk, <b>file</b> for a shared folder',
				'<b>SQL</b> is strong for consistent transactions, <b>NoSQL</b> is strong for huge and varied data'
			],
			nextNote:
				'Next up: <b>Data Flow</b>. We look at data coming in and going out of a server (ingress and egress), and why heavy traffic jams up at one point (a bottleneck).',
			restart: 'Start over'
		}
	}
};
