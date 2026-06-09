import AutoScalingStage from '$lib/components/stages/AutoScalingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const autoScaling: Lesson = {
	id: 'auto-scaling',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'idea', 'happy'],
	reactionMood: { 'scaled-up': 'excited', 'scaled-down': 'happy' },
	stage: AutoScalingStage,
	text: { id, en }
};
