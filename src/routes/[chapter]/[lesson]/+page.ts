import { error } from '@sveltejs/kit';
import { getChapter, getLessonIndex } from '$lib/chapters';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const chapter = getChapter(params.chapter);
	if (!chapter) error(404, 'Chapter not found');
	const index = getLessonIndex(chapter, params.lesson);
	if (index < 0) error(404, 'Lesson not found');
	return {
		chapterId: chapter.id,
		lessonId: params.lesson,
		index,
		total: chapter.lessons.length
	};
};
