import LayersStage from '$lib/components/stages/LayersStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const layers: Lesson = {
	id: 'layers',
	mood: 'thinking',
	moods: [
		'calm',
		'idea',
		'calm',
		'thinking',
		'calm',
		'calm',
		'thinking',
		'happy',
		'idea',
		'excited'
	],
	reactionMood: { tcp: 'happy', udp: 'surprised', both: 'excited' },
	stage: LayersStage,
	text: { id, en }
};
