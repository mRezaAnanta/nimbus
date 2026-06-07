import RegionStage from '$lib/components/stages/RegionStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const region: Lesson = {
	id: 'region',
	mood: 'happy',
	stage: RegionStage,
	text: { id, en }
};
