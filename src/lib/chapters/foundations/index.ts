import type { Chapter } from '../types';
import { server } from './server';
import { requestJourney } from './request-journey';
import { virtualMachine } from './virtual-machine';
import { laptopServer } from './laptop-server';
import { tunneling } from './tunneling';

export const foundations: Chapter = {
	id: 'foundations',
	number: 1,
	title: { id: 'Client & Server', en: 'Client & Server' },
	lessons: [server, requestJourney, virtualMachine, laptopServer, tunneling],
	summary: {
		id: {
			title: 'Bab 1 selesai',
			sub: 'Kamu sudah paham dasar client dan server:',
			items: [
				'<b>Server</b> adalah komputer yang melayani permintaan dari <b>client</b> seperti HP-mu',
				'Tiap permintaan menempuh perjalanan <b>HP, router, ISP, jaringan dunia</b>, lalu balik lagi',
				'Satu server fisik bisa dibelah jadi beberapa <b>virtual machine</b> yang terasa seperti komputer utuh',
				'Laptopmu bisa jadi server, tapi <b>IP rumah berubah ubah</b>, harus nyala 24 jam, dan unggahannya kecil',
				'<b>Tunneling</b> (misalnya ngrok) meminjamkan pintu publik lewat pihak ketiga, pas buat demo, bukan buat produksi'
			],
			nextNote:
				'Berikutnya: <b>Cloud</b>. Dari semua masalah tadi, kita akhirnya menyewa server sungguhan di data center, dan melihat kabel serta lokasi yang membuatnya cepat.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 1 complete',
			sub: 'You now understand clients and servers:',
			items: [
				'A <b>server</b> is a computer that answers requests from a <b>client</b> like your phone',
				'Every request travels <b>phone, router, ISP, global network</b>, and all the way back',
				'One physical server can be sliced into several <b>virtual machines</b> that each feel like a whole computer',
				'Your laptop can be a server, but the <b>home IP keeps changing</b>, it must stay on 24 hours, and uploads are tiny',
				'<b>Tunneling</b> (ngrok, for example) borrows a public door through a third party, great for demos, not for production'
			],
			nextNote:
				'Next up: <b>The Cloud</b>. After all those problems, we finally rent a real server in a data center, and meet the cables and locations that make it fast.',
			restart: 'Start over'
		}
	}
};
