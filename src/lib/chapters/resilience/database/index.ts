import DatabaseStage from '$lib/components/stages/DatabaseStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const database: Lesson = {
	id: 'database',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { sql: 'happy', nosql: 'happy', wrong: 'worried' },
	stage: DatabaseStage,
	text: { id, en }
};
