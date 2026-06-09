import CapstoneStage from '$lib/components/stages/CapstoneStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const build: Lesson = {
	id: 'build',
	mood: 'excited',
	moods: ['happy', 'thinking', 'idea'],
	reactionMood: {
		multiaz: 'happy',
		traffic: 'happy',
		cdn: 'happy',
		data: 'happy',
		security: 'happy',
		monitoring: 'wink',
		tested: 'excited'
	},
	stage: CapstoneStage,
	text: { id, en }
};
