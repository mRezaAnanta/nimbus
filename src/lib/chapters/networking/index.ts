import type { Chapter } from '../types';
import { dns } from './dns';
import { vpc } from './vpc';
import { firewall } from './firewall';
import { iam } from './iam';
import { encryption } from './encryption';
import { sharedResponsibility } from './shared-responsibility';

export const networking: Chapter = {
	id: 'networking',
	number: 5,
	title: { id: 'Jaringan & Keamanan', en: 'Networking & Security' },
	lessons: [dns, vpc, firewall, iam, encryption, sharedResponsibility],
	summary: {
		id: {
			title: 'Bab 5 selesai',
			sub: 'Kamu sudah paham jaringan dan keamanannya:',
			items: [
				'Setiap server punya <b>alamat IP</b>, dan <b>DNS</b> mengubah nama seperti nimbus.com jadi IP itu',
				'Sebuah <b>VPC</b> adalah private network milikmu, dengan <b>public subnet</b> untuk web dan <b>private subnet</b> untuk database',
				'Aturan <b>firewall</b> mengizinkan atau menolak trafik per port dan sumber, dan paling aman dimulai dari <b>tolak semua</b> lalu izinkan yang perlu saja',
				'<b>Autentikasi</b> membuktikan siapa kamu, <b>otorisasi</b> menentukan apa yang boleh, dan <b>least privilege</b> memberi akses seperlunya',
				'<b>Enkripsi</b> mengacak data agar hanya pemegang kunci yang bisa membaca, saat berjalan (HTTPS) maupun saat disimpan',
				'<b>Shared responsibility</b>, provider mengamankan cloud-nya, kamu mengamankan data, akses, dan konfigurasimu'
			],
			nextNote:
				'Berikutnya: <b>Komputasi & Operasi</b>. Cara modern menjalankan aplikasi, dari container sampai serverless, lalu memantau dan menjaga biayanya.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 5 complete',
			sub: 'You now understand the network and its security:',
			items: [
				'Every server has an <b>IP address</b>, and <b>DNS</b> turns a name like nimbus.com into that IP',
				'A <b>VPC</b> is your private network, with a <b>public subnet</b> for the web and a <b>private subnet</b> for the database',
				'<b>Firewall</b> rules allow or deny traffic by port and source, and the safest setup starts by <b>denying everything</b> then allowing only what is needed',
				'<b>Authentication</b> proves who you are, <b>authorization</b> decides what you may do, and <b>least privilege</b> grants only what is needed',
				'<b>Encryption</b> scrambles data so only key holders can read it, both in transit (HTTPS) and at rest',
				'<b>Shared responsibility</b>, the provider secures the cloud, you secure your data, access, and configuration'
			],
			nextNote:
				'Next up: <b>Compute & Operations</b>. Modern ways to run your app, from containers to serverless, then watching it and keeping the bill in check.',
			restart: 'Start over'
		}
	}
};
