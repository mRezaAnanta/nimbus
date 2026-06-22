import type { Chapter } from '../types';
import { build } from './build';

export const capstone: Chapter = {
	id: 'capstone',
	number: 8,
	unnumbered: true,
	title: { id: 'Jalur Provider', en: 'Provider Tracks' },
	lessons: [build],
	summary: {
		id: {
			title: 'Bagian 1 selesai',
			sub: 'Kamu sudah punya fondasi cloud yang utuh:',
			items: [
				'Dari <b>satu server</b> sampai banyak server yang tersebar dan tahan gangguan',
				'Cara <b>melayani trafik</b>: reverse proxy, load balancer, scaling, auto scaling, dan CDN',
				'Cara <b>menjalankan</b> dan <b>menyimpan</b>: VM, container, serverless, storage, dan database',
				'Cara <b>mengamankan</b> dan <b>mengawasi</b>: jaringan, IAM, enkripsi, monitoring, dan biaya'
			],
			nextNote:
				'Berikutnya, Bagian 2: jalur per penyedia (AWS, GCP, Azure). Di sana tiap konsep ini berubah jadi layanan nyata dengan nama aslinya.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Part 1 complete',
			sub: 'You now have a complete cloud foundation:',
			items: [
				'From <b>one server</b> to many spread out servers that survive trouble',
				'How to <b>serve traffic</b>: reverse proxy, load balancer, scaling, auto scaling, and a CDN',
				'How to <b>run</b> and <b>store</b>: VMs, containers, serverless, storage, and databases',
				'How to <b>secure</b> and <b>watch</b>: networking, IAM, encryption, monitoring, and cost'
			],
			nextNote:
				'Next up, Part 2: the per provider tracks (AWS, GCP, Azure). There each concept becomes a real service with its actual name.',
			restart: 'Start over'
		}
	}
};
