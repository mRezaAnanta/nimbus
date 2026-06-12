import TunnelingStage from '$lib/components/stages/TunnelingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const tunneling: Lesson = {
	id: 'tunneling',
	mood: 'idea',
	moods: ['idea', 'thinking', 'idea', 'calm', 'happy'],
	reactionMood: { tunnel: 'excited', visited: 'happy', closed: 'worried' },
	stage: TunnelingStage,
	text: { id, en }
};
