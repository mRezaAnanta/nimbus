import CostStage from '$lib/components/stages/CostStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cost: Lesson = {
	id: 'cost',
	mood: 'thinking',
	moods: ['thinking', 'worried', 'idea', 'happy'],
	reactionMood: { off: 'happy', resize: 'excited' },
	stage: CostStage,
	text: { id, en }
};
