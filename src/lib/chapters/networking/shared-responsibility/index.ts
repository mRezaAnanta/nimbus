import SharedResponsibilityStage from '$lib/components/stages/SharedResponsibilityStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const sharedResponsibility: Lesson = {
	id: 'shared-responsibility',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { correct: 'happy', wrong: 'worried' },
	stage: SharedResponsibilityStage,
	text: { id, en }
};
