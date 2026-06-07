import { redirect, error } from '@sveltejs/kit';
import { getChapter } from '$lib/chapters';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const chapter = getChapter(params.chapter);
	if (!chapter) error(404, 'Chapter not found');
	redirect(307, `/${chapter.id}/${chapter.lessons[0].id}`);
};
