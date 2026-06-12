import CapstoneStage from '$lib/components/stages/CapstoneStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const build: Lesson = {
	id: 'build',
	mood: 'excited',
	moods: ['excited', 'idea', 'happy'],
	reactionMood: { picked: 'excited', subscribed: 'happy' },
	stage: CapstoneStage,
	text: { id, en }
};
