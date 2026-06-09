import type { Chapter } from '../types';
import { virtualMachine } from './virtual-machine';
import { container } from './container';
import { serverless } from './serverless';

export const compute: Chapter = {
	id: 'compute',
	number: 4,
	title: { id: 'Komputasi', en: 'Compute' },
	lessons: [virtualMachine, container, serverless],
	summary: {
		id: {
			title: 'Bab 4 selesai',
			sub: 'Kamu sekarang paham cara menjalankan aplikasi di cloud:',
			items: [
				'Sebuah <b>virtual machine</b> adalah komputer virtual utuh dengan OS sendiri yang berbagi satu hardware',
				'Sebuah <b>container</b> adalah paket ringan dan portabel yang jalan sama persis di mana saja',
				'<b>Serverless</b> menjalankan fungsimu saat dipanggil dan turun ke nol saat sepi, jadi kamu bayar per panggilan'
			],
			nextNote:
				'Berikutnya: <b>Penyimpanan</b>. Kita bahas cara menyimpan data, mulai dari jenis penyimpanan dan database sampai replikasi dan backup.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 4 complete',
			sub: 'You now understand how to run apps in the cloud:',
			items: [
				'A <b>virtual machine</b> is a full virtual computer with its own OS that shares one set of hardware',
				'A <b>container</b> is a light, portable package that runs the same anywhere',
				'<b>Serverless</b> runs your function on demand and scales to zero when idle, so you pay per call'
			],
			nextNote:
				'Next up: <b>Storage</b>. We will see how to keep data, from storage types and databases to replication and backups.',
			restart: 'Start over'
		}
	}
};
