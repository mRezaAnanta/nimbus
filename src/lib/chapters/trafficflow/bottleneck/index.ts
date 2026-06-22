import BottleneckStage from '$lib/components/stages/BottleneckStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const bottleneck: Lesson = {
	id: 'bottleneck',
	mood: 'thinking',
	moods: ['thinking', 'worried', 'happy'],
	reactionMood: { jam: 'worried', fixed: 'happy' },
	stage: BottleneckStage,
	text: { id, en }
};
