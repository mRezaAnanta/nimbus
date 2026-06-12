import type { LessonText } from '../types';

export interface ContainerText extends LessonText {
	buildLabel: string;
	buildHint: string;
	imageLabel: string;
	runHere: string;
	hostLabel: string; // template with {n}
	vmTitle: string;
	vmSub: string;
	vmSize: string;
	vmBoot: string;
	containerTitle: string;
	containerSub: string;
	containerSize: string;
	containerBoot: string;
	bootingOs: string;
	appLabel: string;
	depsLabel: string;
	runningHere: string;
}

export interface ServerlessText extends LessonText {
	alwaysOnTitle: string;
	alwaysOnSub: string;
	serverlessTitle: string;
	serverlessSub: string;
	sendRequest: string;
	idleLabel: string;
	runningLabel: string;
	zeroLabel: string;
	costLabel: string;
	tickHint: string;
	invokeHint: string;
	functionLabel: string;
	requestLabel: string;
}

export interface MonitoringText extends LessonText {
	cpuLabel: string;
	trafficLabel: string;
	errorsLabel: string;
	thresholdLabel: string; // template with {n}
	setAlarm: string;
	alarmArmed: string; // template with {n}
	alarmFiring: string;
	allCalm: string;
	siteUp: string;
	siteWarn: string;
	hint: string;
}

export interface CostText extends LessonText {
	billLabel: string;
	perMonth: string;
	idleLabel: string;
	idleSub: string;
	bigLabel: string;
	bigSub: string;
	rightLabel: string;
	rightSub: string;
	turnOff: string;
	downsize: string;
	usageLabel: string; // template with {n}
	tooSmall: string;
	hint: string;
}
