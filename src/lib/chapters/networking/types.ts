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

export interface LayersText extends LessonText {
	scenarioNote: string; // the one concrete scenario, shown above the whole journey
	startTag: string; // tiny label over the core request card
	/**
	 * The OSI layers, top (Application) to bottom (Physical). The number is derived from position.
	 * `chip` is the concrete thing this layer adds (the wrapper you see stack onto the parcel),
	 * `job` is the one line explanation, `where` ties it to something the learner already knows.
	 * LayersStage.svelte shows one request gaining a `chip` wrapper at each step, then unwrapped.
	 */
	layers: { name: string; chip: string; job: string; where: string }[];
	arriveNote: string; // caption when the server has unwrapped and read the request
	recapTitle: string; // panel heading on the closing recap beat
	wrapLabel: string; // recap arrow, sending side (top down)
	unwrapLabel: string; // recap arrow, receiving side (bottom up)
	orderNote: string; // recap caption, how the layers relate and why the order holds
	playPrompt: string; // above the TCP and UDP buttons
	tcpBtn: string;
	udpBtn: string;
	senderLabel: string;
	receiverLabel: string;
	connectingLabel: string; // TCP handshake in progress
	connectedLabel: string; // TCP handshake done
	lostLabel: string; // tag on a dropped packet
	receivedLabel: string; // header over the arrived tally
	tcpUse: string; // real world tie, shown after a TCP send
	udpUse: string; // real world tie, shown after a UDP send
	tryBothHint: string; // shown until both have been tried
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
