import type { Chapter } from '../types';
import { server } from './server';
import { requestJourney } from './request-journey';
import { api } from './api';
import { apiRest } from './apiRest';
import { apiGraphql } from './apiGraphql';
import { apiGrpc } from './apiGrpc';
import { apiWebsocket } from './apiWebsocket';
import { apiWebhook } from './apiWebhook';
import { port } from './port';
import { virtualMachine } from './virtual-machine';
import { laptopServer } from './laptop-server';
import { tunneling } from './tunneling';
import { cliGui } from './cli-gui';

export const foundations: Chapter = {
	id: 'foundations',
	number: 1,
	title: { id: 'Client & Server', en: 'Client & Server' },
	lessons: [
		server,
		requestJourney,
		api,
		apiRest,
		apiGraphql,
		apiGrpc,
		apiWebsocket,
		apiWebhook,
		port,
		virtualMachine,
		laptopServer,
		tunneling,
		cliGui
	],
	summary: {
		id: {
			title: 'Bab 1 selesai',
			sub: 'Kamu sudah paham dasar client dan server:',
			items: [
				'<b>Server</b> adalah komputer yang melayani permintaan dari <b>client</b> seperti HP-mu',
				'Tiap permintaan menempuh perjalanan <b>HP, router, ISP, jaringan dunia</b>, lalu balik lagi',
				'Selain halaman buat orang, server punya <b>API</b> yang mengembalikan data polos (<b>JSON</b>) buat program, jadi aplikasi bisa saling minta data',
				'Satu server punya satu alamat tapi banyak <b>port</b> (pintu bernomor), tiap layanan punya sendiri, misalnya web di 80 dan 443, SSH di 22, RDP di 3389',
				'Satu server fisik bisa dibelah jadi beberapa <b>virtual machine</b> yang terasa seperti komputer utuh',
				'Laptopmu bisa jadi server, tapi <b>IP rumah berubah ubah</b>, harus nyala 24 jam, dan unggahannya kecil',
				'<b>Tunneling</b> (misalnya ngrok) meminjamkan pintu publik lewat pihak ketiga, pas buat demo, bukan buat produksi',
				'Komputer dikontrol lewat <b>GUI</b> (klik tombol) atau <b>CLI</b> (ketik perintah), dan server biasanya diurus lewat CLI'
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
				'Besides a page for people, a server has an <b>API</b> that returns plain data (<b>JSON</b>) for programs, so apps can ask each other for data',
				'A server has one address but many <b>ports</b> (numbered doors), one per service, like web on 80 and 443, SSH on 22, RDP on 3389',
				'One physical server can be sliced into several <b>virtual machines</b> that each feel like a whole computer',
				'Your laptop can be a server, but the <b>home IP keeps changing</b>, it must stay on 24 hours, and uploads are tiny',
				'<b>Tunneling</b> (ngrok, for example) borrows a public door through a third party, great for demos, not for production',
				'A computer is controlled through a <b>GUI</b> (clicking buttons) or a <b>CLI</b> (typing commands), and servers are usually run through the CLI'
			],
			nextNote:
				'Next up: <b>The Cloud</b>. After all those problems, we finally rent a real server in a data center, and meet the cables and locations that make it fast.',
			restart: 'Start over'
		}
	}
};
