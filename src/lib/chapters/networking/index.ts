import type { Chapter } from '../types';
import { dns } from './dns';
import { vpc } from './vpc';
import { firewall } from './firewall';

export const networking: Chapter = {
	id: 'networking',
	number: 6,
	title: { id: 'Jaringan', en: 'Networking' },
	lessons: [dns, vpc, firewall],
	summary: {
		id: {
			title: 'Bab 6 selesai',
			sub: 'Kamu sudah paham soal jaringan:',
			items: [
				'Setiap server punya <b>alamat IP</b>, dan <b>DNS</b> mengubah nama seperti nimbus.dev jadi IP itu',
				'Sebuah <b>VPC</b> adalah jaringan privatmu, dengan <b>subnet publik</b> untuk web dan <b>subnet privat</b> untuk database',
				'Aturan <b>firewall</b> mengizinkan atau menolak trafik per port dan sumber, dengan default <b>tolak semua</b>'
			],
			nextNote:
				'Berikutnya: <b>Keamanan</b>. Kita bahas identitas dan akses, enkripsi, serta tanggung jawab yang dibagi antara kamu dan penyedia cloud.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 6 complete',
			sub: 'You now understand networking:',
			items: [
				'Every server has an <b>IP address</b>, and <b>DNS</b> turns a name like nimbus.dev into that IP',
				'A <b>VPC</b> is your private network, with a <b>public subnet</b> for the web and a <b>private subnet</b> for the database',
				'<b>Firewall</b> rules allow or deny traffic by port and source, with a default of <b>deny everything</b>'
			],
			nextNote:
				'Next up: <b>Security</b>. We will cover identity and access, encryption, and the responsibility shared between you and the cloud provider.',
			restart: 'Start over'
		}
	}
};
