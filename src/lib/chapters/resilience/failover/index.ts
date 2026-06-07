import FailoverStage from '$lib/components/stages/FailoverStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const failover: Lesson = {
	id: 'failover',
	mood: 'thinking',
	stage: FailoverStage,
	text: { id, en }
};
