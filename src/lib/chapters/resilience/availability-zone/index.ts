import AZStage from '$lib/components/stages/AZStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const availabilityZone: Lesson = {
	id: 'availability-zone',
	mood: 'thinking',
	stage: AZStage,
	text: { id, en }
};
