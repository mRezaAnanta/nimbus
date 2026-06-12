import CdnStage from '$lib/components/stages/CdnStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cdn: Lesson = {
	id: 'cdn',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'calm', 'happy'],
	reactionMood: { origin: 'worried', enabled: 'idea', cached: 'excited' },
	stage: CdnStage,
	text: { id, en }
};
