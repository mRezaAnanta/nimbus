import ApiStyleStage from '$lib/components/stages/ApiStyleStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const apiRest: Lesson = {
	id: 'apiRest',
	section: 'API',
	mood: 'calm',
	moods: ['calm', 'idea', 'happy', 'thinking', 'surprised', 'wink'],
	stage: ApiStyleStage,
	text: { id, en }
};
