import MonitoringStage from '$lib/components/stages/MonitoringStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const monitoring: Lesson = {
	id: 'monitoring',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy'],
	reactionMood: { alarm: 'excited' },
	stage: MonitoringStage,
	text: { id, en }
};
