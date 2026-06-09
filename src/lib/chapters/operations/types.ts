import type { LessonText } from '../types';

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
