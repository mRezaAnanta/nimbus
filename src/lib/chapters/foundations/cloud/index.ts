import CloudStage from '$lib/components/stages/CloudStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cloud: Lesson = {
	id: 'cloud',
	mood: 'thinking',
	stage: CloudStage,
	text: { id, en }
};
