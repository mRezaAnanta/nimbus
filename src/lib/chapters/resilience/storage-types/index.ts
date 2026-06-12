import StorageTypesStage from '$lib/components/stages/StorageTypesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const storageTypes: Lesson = {
	id: 'storage-types',
	mood: 'calm',
	moods: ['calm', 'idea', 'thinking', 'happy'],
	reactionMood: { object: 'idea', block: 'thinking', file: 'happy' },
	stage: StorageTypesStage,
	text: { id, en }
};
