import type { LessonText } from '../types';

export interface ReverseProxyText extends LessonText {
	proxyLabel: string;
	proxySub: string;
	publicAddr: string;
	hiddenLabel: string;
	send: string;
	routes: { path: string; label: string; backend: string }[];
	backends: Record<string, string>;
	routedNote: string; // template with {n}
}

export interface LoadBalancerText extends LessonText {
	startSale: string;
	addBalancer: string;
	killServer: string;
	reset: string;
	balancerLabel: string;
	serverLabel: string; // template with {n}
	statusUp: string;
	statusOver: string;
	statusDown: string;
	siteFast: string;
	siteSlow: string;
	siteDown: string;
	loadLabel: string;
}

export interface ScalingText extends LessonText {
	verticalBtn: string;
	horizontalBtn: string;
	reset: string;
	verticalLabel: string;
	horizontalLabel: string;
	cpuLabel: string;
	maxedOut: string;
	addNote: string;
	workloadLabel: string;
	tradeoffVertical: string;
	tradeoffHorizontal: string;
}

export interface AutoScalingText extends LessonText {
	play: string;
	running: string;
	again: string;
	serversLabel: string; // template with {n}
	costLabel: string;
	trafficLabel: string;
	night: string;
	midday: string;
	payNote: string;
}

export interface CdnText extends LessonText {
	cdnOn: string;
	cdnOff: string;
	send: string;
	originLabel: string;
	edgeLabel: string;
	userLabel: string;
	ms: string;
	farNote: string;
	nearNote: string;
	off: string;
	on: string;
}
