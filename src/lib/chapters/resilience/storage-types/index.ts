import StorageTypesStage from '$lib/components/stages/StorageTypesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const storageTypes: Lesson = {
	id: 'storage-types',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { correct: 'happy', wrong: 'worried' },
	stage: StorageTypesStage,
	text: { id, en }
};
