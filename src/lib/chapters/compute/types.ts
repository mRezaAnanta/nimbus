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
