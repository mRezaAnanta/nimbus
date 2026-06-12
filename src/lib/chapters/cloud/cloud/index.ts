import CloudStage from '$lib/components/stages/CloudStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cloud: Lesson = {
	id: 'cloud',
	mood: 'thinking',
	moods: ['thinking', 'surprised', 'happy'],
	reactionMood: { home: 'worried', cloud: 'happy', both: 'idea' },
	stage: CloudStage,
	text: { id, en }
};
