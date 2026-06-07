import type { ServerText } from '../../types';

export const id: ServerText = {
	title: 'Apa itu server?',
	intro: [
		'Setiap kali kamu membuka sebuah situs, ada satu komputer di suatu tempat yang mengirim halaman itu ke layarmu.',
		'Komputer itu namanya <b>server</b>. Bedanya dengan laptopmu: dia menyala 24 jam dan tugasnya cuma satu, melayani permintaan pengunjung.',
		'Biar kebayang, coba sendiri: klik <b>Buka website</b> di sebelah, lalu perhatikan apa yang dilakukan server.'
	],
	reactions: {
		served: 'Nah, itu yang barusan terjadi: HP-mu <b>minta</b> halaman, server <b>mengirimnya</b> balik. Sesederhana itu inti kerja sebuah server.'
	},
	you: 'Kamu',
	server: 'Server',
	open: 'Buka website',
	request: 'minta halaman',
	response: 'kirim halaman',
	count: 'Dilayani {n}×'
};
