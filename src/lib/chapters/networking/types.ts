import type { LessonText } from '../types';

export interface DnsText extends LessonText {
	youLabel: string;
	bookTitle: string;
	bookSub: string;
	serverLabel: string;
	domains: { host: string; ip: string }[];
	idleNote: string;
	lookupNote: string;
	connectNote: string; // template with {ip}
}

export interface NetworkText extends LessonText {
	vpcLabel: string;
	vpcSub: string;
	internetLabel: string;
	publicLabel: string;
	publicSub: string;
	privateLabel: string;
	privateSub: string;
	webLabel: string;
	dbLabel: string;
	visitSite: string;
	attackDb: string;
	noteIdle: string;
	noteWeb: string;
	noteBlocked: string;
}

export interface FirewallText extends LessonText {
	guardLabel: string;
	guardSub: string;
	serverLabel: string;
	rulesTitle: string;
	ruleAllow: string;
	ruleDeny: string;
	guestWeb: string;
	guestBad: string;
	sendWeb: string;
	sendBad: string;
	allowedTag: string;
	deniedTag: string;
	noteIdle: string;
	noteAllow: string;
	noteDeny: string;
}

export interface IamText extends LessonText {
	personLabel: string;
	badgeAdmin: string;
	badgeAdminSub: string;
	badgeScoped: string;
	badgeScopedSub: string;
	doors: { key: string; label: string; scoped: boolean }[];
	openTag: string;
	shutTag: string;
	noteIdle: string;
	noteAdmin: string;
	noteScoped: string;
}

export interface EncryptionText extends LessonText {
	youLabel: string;
	snooperLabel: string;
	serverLabel: string;
	message: string;
	cipher: string;
	sendPlain: string;
	sendLocked: string;
	readTag: string;
	scrambledTag: string;
	noteIdle: string;
	notePlain: string;
	noteLocked: string;
}

export interface SharedResponsibilityText extends LessonText {
	providerTitle: string;
	providerSub: string;
	youTitle: string;
	youSub: string;
	providerItems: string[];
	youItems: string[];
	reveal: string;
	noteIdle: string;
	noteDone: string;
}
