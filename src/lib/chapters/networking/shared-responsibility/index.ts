import SharedResponsibilityStage from '$lib/components/stages/SharedResponsibilityStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const sharedResponsibility: Lesson = {
	id: 'shared-responsibility',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'idea', 'happy'],
	reactionMood: { shown: 'happy' },
	stage: SharedResponsibilityStage,
	text: { id, en }
};
