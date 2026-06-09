import type { Chapter } from '../types';
import { storageTypes } from './storage-types';
import { database } from './database';
import { replication } from './replication';

export const storage: Chapter = {
	id: 'storage',
	number: 5,
	title: { id: 'Penyimpanan', en: 'Storage' },
	lessons: [storageTypes, database, replication],
	summary: {
		id: {
			title: 'Bab 5 selesai',
			sub: 'Kamu sudah paham soal penyimpanan:',
			items: [
				'<b>Object</b> untuk file utuh, <b>block</b> untuk disk satu mesin, <b>file</b> untuk folder bersama',
				'<b>SQL</b> kuat untuk transaksi yang konsisten, <b>NoSQL</b> kuat untuk data besar dan beragam',
				'<b>Replikasi</b> untuk pengambilalihan hidup saat gangguan, <b>cadangan</b> untuk memulihkan dari kesalahan'
			],
			nextNote:
				'Berikutnya: <b>Jaringan</b>. Kita bahas IP dan DNS, jaringan privat dan subnet, sampai firewall.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 5 complete',
			sub: 'You now understand storage:',
			items: [
				'<b>Object</b> for whole files, <b>block</b> for a single machine disk, <b>file</b> for a shared folder',
				'<b>SQL</b> is strong for consistent transactions, <b>NoSQL</b> is strong for huge and varied data',
				'<b>Replication</b> for live takeover during a failure, <b>backups</b> for recovering from mistakes'
			],
			nextNote:
				'Next up: <b>Networking</b>. We will cover IP and DNS, private networks and subnets, and the firewall.',
			restart: 'Start over'
		}
	}
};
