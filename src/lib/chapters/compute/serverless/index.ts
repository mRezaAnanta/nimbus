import ServerlessStage from '$lib/components/stages/ServerlessStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const serverless: Lesson = {
	id: 'serverless',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { invoke: 'excited', idle: 'worried' },
	stage: ServerlessStage,
	text: { id, en }
};
