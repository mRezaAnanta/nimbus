import type { LessonText } from '../types';

export interface IngressEgressText extends LessonText {
	visitorLabel: string;
	serverLabel: string;
	billLabel: string; // "Egress bill"
	pickIn: string;
	pickOut: string;
	inTag: string; // shown on the flow, e.g. "In, free"
	outTag: string; // e.g. "Out, billed"
}

export interface BottleneckText extends LessonText {
	// live status readout
	okStatus: string; // "Flowing"
	jamStatus: string; // "Overwhelmed"
	queueLabel: string; // e.g. "waiting" next to the queue count
	// the two sides of the same problem
	customerLabel: string; // "What visitors see"
	devLabel: string; // "Behind the scenes"
	visitorsLabel: string; // e.g. "visitors" next to the live count
	// customer phone (what one visitor sees)
	shopUrl: string; // address shown in the mini browser
	loadingLabel: string; // page state while jammed
	okPageLabel: string; // page state while healthy
	secUnit: string; // seconds unit for the load time, e.g. "dtk" / "s"
	// backend diagram
	dbLabel: string; // the one database (the choke)
	bottleneckTag: string; // tag pinned on the choke point
	// controls
	addBtn: string; // add load
	fixBtn: string; // relieve the one point
}

export interface BandwidthThroughputText extends LessonText {
	sourceLabel: string; // what the server is serving, e.g. "Your video"
	addBtn: string;
	upgradeBtn: string;
	tpLabel: string; // "Throughput"
	bwLabel: string; // "Bandwidth"
	unit: string; // "MB/s"
	hd: string; // smooth label, e.g. "HD"
	buffering: string; // stalled label
}
