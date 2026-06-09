import type { LessonText } from '../types';

export interface DnsText extends LessonText {
	prompt: string;
	resolveLabel: string;
	connectLabel: string;
	resolverTitle: string;
	resolving: string;
	resolved: string;
	connecting: string;
	connected: string;
	ipLabel: string;
	again: string;
	domains: Record<string, string>;
}

export interface NetworkText extends LessonText {
	vpcLabel: string;
	publicLabel: string;
	publicSub: string;
	privateLabel: string;
	privateSub: string;
	webLabel: string;
	dbLabel: string;
	placeWeb: string;
	placeDb: string;
	testLabel: string;
	reachable: string;
	blocked: string;
	exposedNote: string;
	securedNote: string;
	reset: string;
}

export interface FirewallText extends LessonText {
	ruleHeader: string;
	allow: string;
	deny: string;
	testLabel: string;
	reset: string;
	succeeded: string;
	failed: string;
	sourceLabel: string;
	portLabel: string;
	connections: Record<string, { name: string; source: string }>;
}
