import type { Chapter } from '../types';
import { cloud } from './cloud';
import { cable } from './cable';
import { region } from './region';

export const cloudChapter: Chapter = {
	id: 'cloud',
	number: 2,
	title: { id: 'Cloud', en: 'The Cloud' },
	lessons: [cloud, cable, region],
	summary: {
		id: {
			title: 'Bab 2 selesai',
			sub: 'Kamu sudah paham apa itu cloud:',
			items: [
				'<b>Cloud</b> itu server di data center penyedia yang biasanya kamu sewa dan bayar sesuai pakai, bukan sesuatu yang ajaib di langit. Perusahaan besar bahkan bisa punya sendiri, namanya <b>private cloud</b>',
				'Data menyeberang dunia lewat <b>kabel serat optik di dasar laut</b>, bukan satelit',
				'<b>Region</b> itu lokasi data center, dan kamu pilih yang terdekat ke pengguna supaya <b>latensinya</b> kecil'
			],
			nextNote:
				'Berikutnya: <b>Ketahanan & Data</b>. Gedung data center bisa tumbang, jadi kita belajar menyebar server, failover, lalu cara menyimpan data dan memilih database.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 2 complete',
			sub: 'You now understand the cloud:',
			items: [
				'<b>Cloud</b> is servers in a provider’s data center that you usually rent and pay as you go, not something magical in the sky. Big companies can even run their own, a <b>private cloud</b>',
				'Data crosses the world through <b>fiber optic cables on the seabed</b>, not satellites',
				'<b>Region</b> is a data center location, and you pick the nearest one to your users to keep <b>latency</b> low'
			],
			nextNote:
				'Next up: <b>Resilience & Data</b>. Data center buildings can fail, so we learn to spread servers, fail over, then store data and pick the right database.',
			restart: 'Start over'
		}
	}
};
