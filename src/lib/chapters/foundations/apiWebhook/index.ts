import ApiStyleStage from '$lib/components/stages/ApiStyleStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const apiWebhook: Lesson = {
	id: 'apiWebhook',
	section: 'API',
	mood: 'surprised',
	moods: ['surprised', 'idea', 'thinking', 'wink'],
	stage: ApiStyleStage,
	text: { id, en }
};
