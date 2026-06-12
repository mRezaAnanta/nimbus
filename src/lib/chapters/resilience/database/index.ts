import DatabaseStage from '$lib/components/stages/DatabaseStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const database: Lesson = {
	id: 'database',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'idea', 'happy'],
	reactionMood: { sql: 'idea', nosql: 'excited' },
	stage: DatabaseStage,
	text: { id, en }
};
