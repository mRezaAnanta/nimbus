import CableStage from '$lib/components/stages/CableStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cable: Lesson = {
	id: 'cable',
	mood: 'thinking',
	stage: CableStage,
	text: { id, en }
};
