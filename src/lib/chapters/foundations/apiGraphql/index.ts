import ApiStyleStage from '$lib/components/stages/ApiStyleStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const apiGraphql: Lesson = {
	id: 'apiGraphql',
	section: 'API',
	mood: 'idea',
	moods: ['idea', 'happy', 'thinking', 'wink'],
	stage: ApiStyleStage,
	text: { id, en }
};
