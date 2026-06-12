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

export interface IamText extends LessonText {
	userLabel: string;
	userSub: string;
	badgeLabel: string;
	adminLabel: string;
	adminHint: string;
	scopedLabel: string;
	scopedHint: string;
	permsTitle: string;
	tryTitle: string;
	allowedTag: string;
	deniedTag: string;
	resetLabel: string;
	/** Permissions the learner can grant. key -> label. */
	perms: Record<string, string>;
	/** Actions the learner can attempt. key -> label. */
	actions: Record<string, string>;
}

export interface EncryptionText extends LessonText {
	youLabel: string;
	recipientLabel: string;
	eavesdropperLabel: string;
	messageLabel: string;
	encryptOff: string;
	encryptOn: string;
	sendLabel: string;
	plainTag: string;
	scrambledTag: string;
	keyLabel: string;
	noKeyLabel: string;
	inTransitNote: string;
	atRestNote: string;
	sample: string;
}

export interface SharedResponsibilityText extends LessonText {
	providerLabel: string;
	providerSub: string;
	youLabel: string;
	youSub: string;
	prompt: string;
	done: string;
	/** Items the learner sorts into a bucket. key -> label. */
	items: Record<string, string>;
}
