import type { Chapter } from '../types';
import { ingressEgress } from './ingress-egress';
import { bandwidthThroughput } from './bandwidth-throughput';
import { bottleneck } from './bottleneck';

export const trafficflow: Chapter = {
	id: 'trafficflow',
	number: 4,
	title: { id: 'Aliran Data', en: 'Data Flow' },
	lessons: [ingressEgress, bandwidthThroughput, bottleneck],
	summary: {
		id: {
			title: 'Bab 4 selesai',
			sub: 'Kamu sudah paham aliran trafik:',
			items: [
				'Data masuk ke server namanya <b>ingress</b>, data keluar namanya <b>egress</b>. Di cloud, ingress biasanya gratis dan egress biasanya dibayar',
				'<b>Bandwidth</b> itu kapasitas maksimal (batas atas), <b>throughput</b> itu yang beneran terkirim per detik, dan pas penonton kebanyakan throughput mentok dan video buffering',
				'Titik sempit yang ngebatasin aliran namanya <b>bottleneck</b>, dan pas trafik rame dia bikin antrian numpuk',
				'Melebarkan satu titik ada batasnya, jadi trafik ramai butuh cara lain biar tetap lancar'
			],
			nextNote:
				'Berikutnya: <b>Lalu Lintas</b>. Kita belajar cara melayani banyak pengunjung sekaligus, dari reverse proxy dan load balancer, scaling, sampai CDN.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 4 complete',
			sub: 'You now understand traffic flow:',
			items: [
				'Data coming into a server is <b>ingress</b>, data leaving is <b>egress</b>. In the cloud, ingress is usually free and egress is usually billed',
				'<b>Bandwidth</b> is the maximum capacity (the ceiling), <b>throughput</b> is what is actually delivered per second, and when too many watch at once throughput maxes out and video buffers',
				'The narrow point that limits flow is a <b>bottleneck</b>, and under heavy traffic it makes a queue pile up',
				'Widening one point has a limit, so heavy traffic needs other approaches to keep flowing'
			],
			nextNote:
				'Next up: <b>Traffic</b>. We learn how to serve many visitors at once, from a reverse proxy and load balancer to scaling and a CDN.',
			restart: 'Start over'
		}
	}
};
