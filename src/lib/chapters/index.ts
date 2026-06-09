import type { Chapter } from './types';
import { foundations } from './foundations';
import { resilience } from './resilience';
import { traffic } from './traffic';
import { compute } from './compute';
import { storage } from './storage';
import { networking } from './networking';
import { security } from './security';
import { operations } from './operations';
import { capstone } from './capstone';

/** All chapters, in order. Add a new chapter by importing it and appending here. */
export const chapters: Chapter[] = [
	foundations,
	resilience,
	traffic,
	compute,
	storage,
	networking,
	security,
	operations,
	capstone
];

export function getChapter(id?: string): Chapter | undefined {
	return chapters.find((c) => c.id === id);
}

/** The chapter after this one, or undefined if this is the last. */
export function getNextChapter(id?: string): Chapter | undefined {
	const i = chapters.findIndex((c) => c.id === id);
	return i >= 0 ? chapters[i + 1] : undefined;
}

export function getLessonIndex(chapter: Chapter, lessonId?: string): number {
	return chapter.lessons.findIndex((l) => l.id === lessonId);
}
