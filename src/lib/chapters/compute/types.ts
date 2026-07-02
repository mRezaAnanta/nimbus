import type { LessonText } from '../types';

export interface ContainerText extends LessonText {
	buildLabel: string;
	runLabel: string;
	imageLabel: string;
	machines: string[];
	sameTag: string;
	pieces: string[];
	yourLaptop: string;
	otherMachine: string;
	brokenTag: string;
	archMachine: string;
	archDocker: string;
	archApps: string[];
	swarmTag: string;
	k8sPlane: string;
	nodeLabel: string; // template with {n}
	k8sBadge: string;
	noteIdle: string;
	noteBuilt: string;
	noteRan: string;
}

export interface MicroservicesText extends LessonText {
	userLabel: string; // heading over the users
	devLabel: string; // heading over the architecture
	monoLabel: string; // title on the one big monolith box
	oneProgram: string; // monolith sublabel, "one program"
	sepPrograms: string; // microservices sublabel, "separate programs"
	downTag: string; // chip on a part that is down
	okTag: string; // a served request
	failTag: string; // a failed request
	/** The three requests users make; the last one (pay) is the one that breaks. */
	requests: { label: string; service: string }[];
	recapMono: string; // recap card, monolith in one line
	recapMicro: string; // recap card, microservices in one line
}

export interface CicdText extends LessonText {
	goodBtn: string; // ship a healthy change
	badBtn: string; // ship a broken change
	commitLabel: string;
	buildLabel: string;
	testLabel: string;
	deployLabel: string;
	liveLabel: string;
	safeNote: string; // shown on production when a bad change is blocked
	ciSub: string; // caption under the CI group (build and test)
	cdSub: string; // caption under the CD group (deploy)
	goodNote: string; // outcome caption after a good ship
	badNote: string; // outcome caption after a blocked ship
	tryBothHint: string; // shown until both have been tried
}

export interface ServerlessText extends LessonText {
	fnLabel: string;
	sleepTag: string;
	wakeTag: string;
	runTag: string;
	send: string;
	callsLabel: string; // template with {n}
	userLabel: string;
	reqTag: string;
	resTag: string;
	alwaysName: string;
	alwaysTag: string;
	archSteps: string[];
	behindItems: string[];
	noteIdle: string;
	noteRun: string;
	noteZero: string;
}

export interface MonitoringText extends LessonText {
	cpuLabel: string;
	trafficLabel: string;
	errorsLabel: string;
	ruleLabel: string;
	surge: string;
	again: string;
	alarmTag: string;
	notifText: string;
	statusOk: string;
	noteIdle: string;
	noteAlarm: string;
}

export interface CostText extends LessonText {
	billLabel: string;
	perMonth: string;
	idleName: string;
	idleSub: string;
	bigName: string;
	bigSub: string;
	rightName: string;
	rightSub: string;
	turnOff: string;
	downsize: string;
	offTag: string;
	resizedTag: string;
	savedTag: string; // template with {n}
	noteIdle: string;
	noteOff: string;
	noteResize: string;
	noteDone: string;
}
