import ServerStage from '$lib/components/stages/ServerStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const server: Lesson = {
	id: 'server',
	mood: 'calm',
	stage: ServerStage,
	text: { id, en }
};
