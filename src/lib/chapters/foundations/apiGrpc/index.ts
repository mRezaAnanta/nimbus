import ApiStyleStage from '$lib/components/stages/ApiStyleStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const apiGrpc: Lesson = {
	id: 'apiGrpc',
	section: 'API',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'calm', 'wink'],
	stage: ApiStyleStage,
	text: { id, en }
};
