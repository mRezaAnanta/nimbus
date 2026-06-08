import type { Component } from 'svelte';

export type Mood = 'calm' | 'happy' | 'thinking';

/**
 * Every interactive stage receives its (already language-resolved) text plus
 * two callbacks: `oncomplete` (unlock "Next") and `onstate` (tell Nim what to say).
 * Stages cast `text` to their own specific text interface, e.g. `text as ServerText`.
 */
export type StageProps = {
	text: LessonText;
	oncomplete?: () => void;
	onstate?: (s: string) => void;
	/** Current narrative beat index, so a stage can play an intro on a specific beat. */
	beat?: number;
	/** Lock or unlock the Next button (e.g. while an intro animation is playing). */
	onlock?: (locked: boolean) => void;
	/** Ask the player to show (un-dim) the stage even when it is not the last beat. */
	onshow?: (visible: boolean) => void;
};

/** Base shape shared by every lesson's text. */
export interface LessonText {
	title: string;
	/** Narrative beats, paged one by one with the Next button so text never gets too long. */
	intro: string[];
	/** token -> Nim's reaction line, shown when the user performs an action on the stage. */
	reactions: Record<string, string>;
}

export interface ServerText extends LessonText {
	you: string;
	server: string;
	open: string;
	request: string;
	response: string;
	count: string; // template with {n}
}

export interface CloudText extends LessonText {
	homeTitle: string;
	homeSub: string;
	cloudTitle: string;
	cloudSub: string;
	homePoints: string[];
	cloudPoints: string[];
	onpremTerm: string;
	cloudTerm: string;
	offline: string;
}

export interface RegionText extends LessonText {
	users: string;
	readoutPrompt: string;
	drag: string;
	flatLabel: string;
	globeLabel: string;
	ms: string;
	verdicts: { instant: string; fast: string; ok: string; slow: string; laggy: string };
	cities: Record<string, string>;
}

export interface CableText extends LessonText {
	users: string;
	prompt: string;
	again: string;
	phases: { leaving: string; undersea: string; arrived: string };
	cablesNote: string;
	routeNote: string;
	credit: string;
	dests: Record<string, string>;
}

export interface AZText extends LessonText {
	worldHint: string;
	back: string;
	serverLabel: string;
	place: string;
	trigger: string;
	statusUp: string;
	statusDown: string;
	activeZones: string;
	regions: Record<string, string>;
	strikeLabel: string;
	news: { src: string; head: string; url: string }[];
}

export interface FailoverText extends LessonText {
	primaryLabel: string;
	standbyLabel: string;
	serving: string;
	standbyState: string;
	failingOver: string;
	kill: string;
	addHint: string;
	statusUp: string;
	statusDown: string;
	regions: Record<string, string>;
}

export type Lesson = {
	id: string;
	mood: Mood;
	stage: Component<StageProps>;
	/** Same shape per language. Resolve with `lesson.text[lang]`. */
	text: { id: LessonText; en: LessonText };
};

export interface ChapterSummary {
	title: string;
	sub: string;
	items: string[];
	nextNote: string;
	restart: string;
}

export type Chapter = {
	id: string;
	number: number;
	title: { id: string; en: string };
	lessons: Lesson[];
	summary: { id: ChapterSummary; en: ChapterSummary };
};
