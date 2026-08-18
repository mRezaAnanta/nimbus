import RequestJourneyStage from '$lib/components/stages/RequestJourneyStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const requestJourney: Lesson = {
	id: 'request-journey',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'idea', 'calm', 'calm', 'happy'],
	reactionMood: { arrived: 'excited', back: 'happy', wifi: 'calm', cell: 'excited' },
	stage: RequestJourneyStage,
	text: { id, en }
};
