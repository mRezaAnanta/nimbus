import type { LessonText } from '../types';

export interface VirtualMachineText extends LessonText {
	hostLabel: string;
	hostSub: string;
	cpuLabel: string;
	ramLabel: string;
	freeLabel: string;
	usedLabel: string;
	addVm: string;
	vmName: string; // template with {n}
	osLabel: string;
	runningLabel: string;
	slowLabel: string;
	overHint: string;
	fitHint: string;
}

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
