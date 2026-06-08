import CableStage from '$lib/components/stages/CableStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cable: Lesson = {
	id: 'cable',
	mood: 'thinking',
	moods: ['thinking', 'surprised', 'excited', 'thinking', 'happy'],
	reactionMood: { leaving: 'thinking', undersea: 'excited', near: 'happy', far: 'surprised' },
	stage: CableStage,
	text: { id, en }
};
