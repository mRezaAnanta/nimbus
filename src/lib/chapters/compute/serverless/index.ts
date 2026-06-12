import ServerlessStage from '$lib/components/stages/ServerlessStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const serverless: Lesson = {
	id: 'serverless',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'calm', 'happy'],
	reactionMood: { invoked: 'excited', zero: 'happy' },
	stage: ServerlessStage,
	text: { id, en }
};
