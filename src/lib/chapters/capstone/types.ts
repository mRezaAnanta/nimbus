import type { LessonText } from '../types';

export interface CapstoneText extends LessonText {
	providers: { key: string; name: string; sub: string }[];
	comingSoon: string;
	pickedTag: string;
	newsTitle: string;
	newsSub: string;
	emailPh: string;
	subscribe: string;
	subscribedMsg: string;
	invalidMsg: string;
	errMsg: string;
	noteIdle: string;
	notePicked: string;
}
