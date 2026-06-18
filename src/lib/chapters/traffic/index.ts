import type { Chapter } from '../types';
import { reverseProxy } from './reverse-proxy';
import { loadBalancer } from './load-balancer';
import { scaling } from './scaling';
import { autoScaling } from './auto-scaling';
import { cdn } from './cdn';

export const traffic: Chapter = {
	id: 'traffic',
	number: 4,
	title: { id: 'Lalu Lintas', en: 'Traffic' },
	lessons: [reverseProxy, loadBalancer, scaling, autoScaling, cdn],
	summary: {
		id: {
			title: 'Bab 4 selesai',
			sub: 'Kamu sudah paham cara melayani banyak pengunjung:',
			items: [
				'Satu <b>reverse proxy</b> jadi pintu depan, mengantar tiap permintaan ke server yang tepat dan menyembunyikan server di belakang',
				'<b>Load balancer</b> membagi trafik ke banyak server (defaultnya bergiliran, bisa pakai cara lain) dan melewati server yang mati',
				'<b>Vertical scaling</b> berarti satu mesin lebih besar (ada batasnya), <b>horizontal scaling</b> berarti lebih banyak mesin (jauh lebih lentur)',
				'<b>Auto scaling</b> menambah dan mengurangi server otomatis, jadi kamu bayar sesuai pemakaian',
				'<b>CDN</b> itu salah satu bentuk caching, yaitu menaruh salinan dekat pengunjung di banyak lokasi supaya cepat dan tidak perlu perjalanan jauh'
			],
			nextNote:
				'Berikutnya: <b>Jaringan & Keamanan</b>. Gimana nama nimbus.com berubah jadi alamat, jaringan privat, firewall, sampai kunci dan identitas.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 4 complete',
			sub: 'You now know how to serve many visitors:',
			items: [
				'A single <b>reverse proxy</b> is the front door, walking each request to the right server and hiding the servers behind it',
				'A <b>load balancer</b> spreads traffic across many servers (round robin by default, other methods exist) and skips a server that is down',
				'<b>Vertical scaling</b> means one bigger machine (it hits a ceiling), <b>horizontal scaling</b> means more machines (far more flexible)',
				'<b>Auto scaling</b> adds and removes servers automatically, so you pay only for what you use',
				'A <b>CDN</b> is a kind of caching, keeping a copy close to visitors in many places so they load fast without a long trip'
			],
			nextNote:
				'Next up: <b>Networking & Security</b>. How the name nimbus.com turns into an address, private networks, firewalls, keys, and identity.',
			restart: 'Start over'
		}
	}
};
