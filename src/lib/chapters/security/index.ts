import type { Chapter } from '../types';
import { iam } from './iam';
import { encryption } from './encryption';
import { sharedResponsibility } from './shared-responsibility';

export const security: Chapter = {
	id: 'security',
	number: 7,
	title: { id: 'Keamanan', en: 'Security' },
	lessons: [iam, encryption, sharedResponsibility],
	summary: {
		id: {
			title: 'Bab 7 selesai',
			sub: 'Kamu sudah paham dasar keamanan:',
			items: [
				'<b>Autentikasi</b> membuktikan siapa kamu, <b>otorisasi</b> menentukan apa yang boleh kamu lakukan, dan <b>least privilege</b> memberi akses seperlunya saja',
				'<b>Enkripsi</b> mengacak data agar hanya pemegang kunci yang bisa membaca, baik saat berjalan (HTTPS) maupun saat disimpan',
				'<b>Shared responsibility</b>: provider mengamankan cloud-nya, kamu mengamankan data, akses, dan konfigurasimu'
			],
			nextNote:
				'Berikutnya: <b>Operasi</b>. Kita bahas cara memantau sistem yang sudah jalan dan menjaga biayanya tetap masuk akal.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 7 complete',
			sub: 'You now understand the basics of security:',
			items: [
				'<b>Authentication</b> proves who you are, <b>authorization</b> decides what you may do, and <b>least privilege</b> grants only the access that is needed',
				'<b>Encryption</b> scrambles data so only key holders can read it, both in transit (HTTPS) and at rest',
				'<b>Shared responsibility</b>: the provider secures the cloud, you secure your data, access, and configuration'
			],
			nextNote:
				'Next up: <b>Operations</b>. We will look at monitoring a running system and keeping its cost under control.',
			restart: 'Start over'
		}
	}
};
