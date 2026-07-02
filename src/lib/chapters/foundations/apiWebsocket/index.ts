import ApiStyleStage from '$lib/components/stages/ApiStyleStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const apiWebsocket: Lesson = {
	id: 'apiWebsocket',
	section: 'API',
	mood: 'idea',
	moods: ['idea', 'excited', 'calm', 'wink'],
	stage: ApiStyleStage,
	text: { id, en }
};
