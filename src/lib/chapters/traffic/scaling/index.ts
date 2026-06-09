import ScalingStage from '$lib/components/stages/ScalingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const scaling: Lesson = {
	id: 'scaling',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'idea', 'happy'],
	reactionMood: { vertical: 'thinking', ceiling: 'worried', horizontal: 'excited' },
	stage: ScalingStage,
	text: { id, en }
};
