import BandwidthThroughputStage from '$lib/components/stages/BandwidthThroughputStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const bandwidthThroughput: Lesson = {
	id: 'bandwidth-throughput',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'happy'],
	reactionMood: { full: 'worried', fixed: 'happy' },
	stage: BandwidthThroughputStage,
	text: { id, en }
};
