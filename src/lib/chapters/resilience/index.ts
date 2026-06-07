import type { Chapter } from '../types';
import { availabilityZone } from './availability-zone';

export const resilience: Chapter = {
	id: 'resilience',
	number: 2,
	title: { id: 'Ketahanan', en: 'Resilience' },
	lessons: [availabilityZone],
	summary: {
		id: {
			title: 'Bab 2 selesai',
			sub: 'Kamu sudah paham soal ketahanan:',
			items: [
				'Satu <b>region</b> berisi beberapa <b>Availability Zone</b>, yaitu data center yang terpisah',
				'Sebar server ke <b>beberapa AZ</b> supaya satu gangguan tidak mematikan semuanya'
			],
			nextNote:
				'Berikutnya: <b>Lalu Lintas</b>. Kita bahas cara melayani banyak pengunjung sekaligus, mulai dari reverse proxy sampai load balancer.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 2 complete',
			sub: 'You now understand resilience:',
			items: [
				'One <b>region</b> holds several <b>Availability Zones</b>, which are separate data centers',
				'Spread servers across <b>multiple AZs</b> so one outage cannot take everything down'
			],
			nextNote:
				'Next up: <b>Traffic</b>. We will see how to serve many visitors at once, from a reverse proxy to a load balancer.',
			restart: 'Start over'
		}
	}
};
