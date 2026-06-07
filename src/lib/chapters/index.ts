import type { Chapter } from './types';
import { foundations } from './foundations';

/** All chapters, in order. Add a new chapter by importing it and appending here. */
export const chapters: Chapter[] = [foundations];

export function getChapter(id?: string): Chapter | undefined {
	return chapters.find((c) => c.id === id);
}

export function getLessonIndex(chapter: Chapter, lessonId?: string): number {
	return chapter.lessons.findIndex((l) => l.id === lessonId);
}
