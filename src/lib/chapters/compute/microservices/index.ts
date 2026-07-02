import MicroservicesStage from '$lib/components/stages/MicroservicesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const microservices: Lesson = {
	id: 'microservices',
	mood: 'calm',
	moods: ['calm', 'calm', 'worried', 'idea', 'happy', 'thinking'],
	stage: MicroservicesStage,
	text: { id, en }
};
