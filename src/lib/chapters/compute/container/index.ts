import ContainerStage from '$lib/components/stages/ContainerStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const container: Lesson = {
	id: 'container',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'happy', 'excited'],
	reactionMood: { shipped: 'happy', scaled: 'excited' },
	stage: ContainerStage,
	text: { id, en }
};
