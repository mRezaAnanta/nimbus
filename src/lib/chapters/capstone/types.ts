import type { LessonText } from '../types';

export interface CapstoneText extends LessonText {
	/** Each capability the learner bolts onto the toy app, with the chapter it came from. */
	caps: { key: string; name: string; recall: string }[];
	addHint: string;
	readiness: string;
	runTest: string;
	testing: string;
	online: string;
	appName: string;
	appWeak: string;
	appReady: string;
	testSteps: string[];
}
